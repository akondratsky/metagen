import { describe, it, expect, afterEach } from 'bun:test';
import type { JsonObject } from '~/json';
import type { MetaTemplateInstance } from './MetaTemplateInstance';
import { AbstractMetaTemplate } from './AbstractMetaTemplate';
import { AbstractFileTreeNode } from '~/fileTree/AbstractFileTreeNode';

describe('AbstractMetaTemplate', () => {
  let instances: MetaTemplateInstance[];
  class TestMetaTemplate extends AbstractMetaTemplate {
    public render(payload: JsonObject): AbstractFileTreeNode | AbstractFileTreeNode[] {
      instances = this.getInstances(payload);
      return [];
    }
  }

  afterEach(() => {
    instances = [];
  });

  describe('text', () => {
    it('"regular_file"', () => {
      const template = new TestMetaTemplate('folder', 'regular_file');
      template.render({});
      expect(instances).toBeArrayOfSize(1);
      expect(instances[0].name).toBe('regular_file');
    });
  });

  describe('interpolation', () => {
    it('{name}', () => {
      const template = new TestMetaTemplate('folder', '{name}42');
      template.render({ name: 'ivan' });
      expect(instances).toBeArrayOfSize(1);
      expect(instances[0].name).toBe('ivan42');
    });
  });

  describe('condition', () => {
    it('"{#include condition}file", condition: true', () => {
      const template = new TestMetaTemplate('folder', '{#include condition}file');
      template.render({ condition: true });
      expect(instances).toBeArrayOfSize(1);
      expect(instances[0].name).toBe('file');
    });

    it('"{#include condition}file", condition: false', () => {
      const template = new TestMetaTemplate('folder', '{#include condition}file');
      template.render({ condition: false });
      expect(instances).toBeArrayOfSize(0);
    });
  });

  describe('iterations', () => {
    it('merges payloads', () => {
      const persons = [{ name: 'ivan' }, { name: 'anatoliy' }];
      const template = new TestMetaTemplate('folder', '{#each persons}{name}42');
      template.render({ persons });
      expect(instances).toBeArrayOfSize(2);
      expect(instances[0]).toEqual({
        name: 'ivan42',
        payload: {
          persons,
          name: 'ivan'
        }
      } as MetaTemplateInstance);
      expect(instances[1]).toEqual({
        name: 'anatoliy42',
        payload: {
          persons,
          name: 'anatoliy'
        }
      });
    });


    it('{#each persons}{name}42', () => {
      const template = new TestMetaTemplate('folder', '{#each persons}{name}42');
      template.render({
        persons: [{ name: 'ivan' }, { name: 'anatoliy' }]
      });
      expect(instances).toBeArrayOfSize(2);
      expect(instances[0].name).toBe('ivan42');
      expect(instances[1].name).toBe('anatoliy42');
    });

    it('nested: "{#each persons}{#each skills}{name}_{skillName}"', () => {
      const template = new TestMetaTemplate('folder', '{#each persons}{#each skills}{name} - {skillName}');
      template.render({
        persons: [{
          name: 'me',
          skills: [{ skillName: 'eat' }, { skillName: 'sleep' }],
        }, {
          name: 'moms friend son',
          skills: [{ skillName: 'be rich'}, { skillName: 'travel' }],
        }]
      });
      expect(instances).toBeArrayOfSize(4);
      expect(instances[0].name).toBe('me - eat');
      expect(instances[1].name).toBe('me - sleep');
      expect(instances[2].name).toBe('moms friend son - be rich');
      expect(instances[3].name).toBe('moms friend son - travel');
    });
  });
});