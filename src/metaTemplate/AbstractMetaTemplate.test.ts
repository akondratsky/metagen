import { describe, it } from 'bun:test';
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

  describe('iterations', () => {
    it('returns multiple instances', () => {
      const template = new TestMetaTemplate('folder', '{#each persons}{name}wtf', new Payload({
        persons: [{ name: 'ivan' }, { name: 'anatoliy' }]
      }));
  
      template.render();
  
      console.log('===INSTANCES', instances);
    });
  });


});