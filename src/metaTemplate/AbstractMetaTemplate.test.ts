import { describe, it, expect } from 'bun:test';
import { Payload } from '~/payload';
import { AbstractMetaTemplate } from './AbstractMetaTemplate';
import { IFileTreeNode } from '~/fileTree';
import { MetaTemplateInstance } from './MetaTemplateInstance';


describe('AbstractMetaTemplate', () => {
  let instances: MetaTemplateInstance[];

  class TestMetaTemplate extends AbstractMetaTemplate {
    render(): IFileTreeNode | IFileTreeNode[] {
      instances = this.getInstances();
      return [];
    }
  }

  describe('text', () => {
    it('"regular_file"', () => {
      const template = new TestMetaTemplate('folder', 'regular_file', new Payload({}));
      template.render();
      expect(instances.length).toBe(1);
      expect(instances[0].name).toBe('regular_file');
    });
  });

  describe('interpolation', () => {
    it('{name}', () => {
      const template = new TestMetaTemplate('folder', '{name}42', new Payload({
        name: 'ivan',
      }));
      template.render();
      expect(instances.length).toBe(1);
      expect(instances[0].name).toBe('ivan42');
    });
  });

  describe('condition', () => {
    it('"{#if condition}file", condition: true', () => {
      const template = new TestMetaTemplate('folder', '{#if condition}file', new Payload({
        condition: true,
      }));
      template.render();
      expect(instances.length).toBe(1);
      expect(instances[0].name).toBe('file');
    });

    it('"{#if condition}file", condition: false', () => {
      const template = new TestMetaTemplate('folder', '{#if condition}file', new Payload({
        condition: false,
      }));
      template.render();
      expect(instances.length).toBe(0);
    });
  });


  describe('iterations', () => {
    it('{#each persons}{name}42', () => {
      const template = new TestMetaTemplate('folder', '{#each persons}{name}42', new Payload({
        persons: [{ name: 'ivan' }, { name: 'anatoliy' }]
      }));
      template.render();
      expect(instances.length).toBe(2);
      expect(instances[0].name).toBe('ivan42');
      expect(instances[1].name).toBe('anatoliy42');
    });

    it('nested: "{#each persons}{#each skills}{name}_{skillName}"', () => {
      const template = new TestMetaTemplate('folder', '{#each persons}{#each skills}{name} - {skillName}', new Payload({
        persons: [{
          name: 'me',
          skills: [{ skillName: 'eat' }, { skillName: 'sleep' }],
        }, {
          name: 'moms friend son',
          skills: [{ skillName: 'be rich'}, { skillName: 'travel' }],
        }]
      }));
      template.render();
      expect(instances.length).toBe(4);
      expect(instances[0].name).toBe('me - eat');
      expect(instances[1].name).toBe('me - sleep');
      expect(instances[2].name).toBe('moms friend son - be rich');
      expect(instances[3].name).toBe('moms friend son - travel');
    });
  });
});