import { describe, it, expect, afterEach } from 'bun:test';
import type { JsonObject } from '~/json';
import { AbstractFileTreeNode } from '~/fileTree/AbstractFileTreeNode';
import type { FileTreeObject } from '~/FileTreeObject';
import type { MetaTemplateInstance } from './MetaTemplateInstance';
import { AbstractMetaTemplate } from './AbstractMetaTemplate';

describe('AbstractMetaTemplate', () => {
  let instances: MetaTemplateInstance[];

  class TestMetaTemplate extends AbstractMetaTemplate {
    public renderToNodes(outputDir: string, payload: JsonObject): AbstractFileTreeNode | AbstractFileTreeNode[] {
      instances = this.getInstances(outputDir, payload);
      return [];
    }
    public renderToJson(outputDir: string, payload: JsonObject): FileTreeObject {
      throw new Error();
    }
  }

  afterEach(() => {
    instances = [];
  });

  describe('text', () => {
    it('"regular_file"', () => {
      const template = new TestMetaTemplate('./template', 'regular_file');
      template.renderToNodes('./output', {});
      expect(instances).toBeArrayOfSize(1);
      expect(instances[0].template).toEqual({ dir: './template', name: 'regular_file'})
      expect(instances[0].output).toEqual({ dir: './output', name: 'regular_file' });
    });
  });

  describe('interpolation', () => {
    it('{name}', () => {
      const template = new TestMetaTemplate('./template', '{name}42');
      template.renderToNodes('./output', { name: 'ivan' });
      expect(instances).toBeArrayOfSize(1);
      expect(instances[0].template).toEqual({ dir: './template', name: '{name}42'})
      expect(instances[0].output).toEqual({ dir: './output', name: 'ivan42' });
    });
  });

  describe('condition', () => {
    it('"{#include condition}file", condition: true', () => {
      const template = new TestMetaTemplate('./template', '{#include condition}file');
      template.renderToNodes('./output', { condition: true });
      expect(instances).toBeArrayOfSize(1);
      expect(instances[0].template).toEqual({ dir: './template', name: '{#include condition}file'})
      expect(instances[0].output).toEqual({ dir: './output', name: 'file' });
    });

    it('"{#include condition}file", condition: false', () => {
      const template = new TestMetaTemplate('./template', '{#include condition}file');
      template.renderToNodes('./output', { condition: false });
      expect(instances).toBeArrayOfSize(0);
    });
  });

  describe('iterations', () => {
    it('merges payloads', () => {
      const persons = [{ name: 'ivan' }, { name: 'anatoliy' }];
      const template = new TestMetaTemplate('./template', '{#each persons}{name}42');
      template.renderToNodes('./output', { persons });
      expect(instances).toBeArrayOfSize(2);
      expect(instances[0].payload).toEqual({ persons, name: 'ivan' });
      expect(instances[1].payload).toEqual({ persons, name: 'anatoliy' });
    });


    it('{#each persons}{name}42', () => {
      const template = new TestMetaTemplate('./template', '{#each persons}{name}42');
      const persons = [{ name: 'ivan' }, { name: 'anatoliy' }];
      template.renderToNodes('./output', { persons });
      expect(instances).toBeArrayOfSize(2);
      expect(instances[0].template).toEqual({ dir: './template', name: '{#each persons}{name}42' });
      expect(instances[0].output).toEqual({ dir: './output', name: 'ivan42' });
      expect(instances[0].payload).toEqual({ persons, name: 'ivan' });
      expect(instances[1].template).toEqual({ dir: './template', name: '{#each persons}{name}42' });
      expect(instances[1].output).toEqual({ dir: './output', name: 'anatoliy42' });
      expect(instances[1].payload).toEqual({ persons, name: 'anatoliy' });
    });

    it('nested: "{#each persons}{#each skills}{name}_{skillName}"', () => {
      const templateName = '{#each persons}{#each skills}{name} - {skillName}';
      const template = new TestMetaTemplate('./template', templateName);
      const persons = [{
        name: 'me',
        skills: [{ skillName: 'eat' }, { skillName: 'sleep' }],
      }, {
        name: 'moms friend son',
        skills: [{ skillName: 'be rich'}, { skillName: 'travel' }],
      }];

      template.renderToNodes('./output', { persons });
      expect(instances).toBeArrayOfSize(4);

      expect(instances[0].template).toEqual({ dir: './template', name: templateName });
      expect(instances[0].output).toEqual({ dir: './output', name: 'me - eat' });
      expect(instances[0].payload).toEqual({
        persons,
        skills: persons[0].skills,
        name: 'me',
        skillName: 'eat'
      });
      expect(instances[1].template).toEqual({ dir: './template', name: templateName });
      expect(instances[1].output).toEqual({ dir: './output', name: 'me - sleep' });
      expect(instances[1].payload).toEqual({
        persons,
        skills: persons[0].skills,
        name: 'me',
        skillName: 'sleep'
      });
      expect(instances[2].template).toEqual({ dir: './template', name: templateName });
      expect(instances[2].output).toEqual({ dir: './output', name: 'moms friend son - be rich' });
      expect(instances[2].payload).toEqual({
        persons,
        skills: persons[1].skills,
        name: 'moms friend son',
        skillName: 'be rich'
      });
      expect(instances[3].template).toEqual({ dir: './template', name: templateName });
      expect(instances[3].output).toEqual({ dir: './output', name: 'moms friend son - travel' });
      expect(instances[3].payload).toEqual({
        persons,
        skills: persons[1].skills,
        name: 'moms friend son',
        skillName: 'travel'
      });
    });
  });
});