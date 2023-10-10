import { DirectoryMetaTemplate } from '~/metaTemplate';
import { describe, test, expect } from 'bun:test';
import { FileTreeObject, DirectoryObject, FileObject } from '~/FileTreeObject';

const directory = (name: string, ...objects: FileTreeObject[]): DirectoryObject => ({
  name,
  isDirectory: true,
  children: objects,
});
const file = (name: string, content: string): FileObject => ({
  isDirectory: false,
  name,
  content,
});

  describe.skip('DirectoryMetaTemplate', () => {
    test('./template1', () => {
      const template = new DirectoryMetaTemplate(import.meta.dir, 'template1');
      const output = template.renderToJson({
        person: 'ivan'
      });
      expect(output).toEqual(
        directory('template1',
          file('ivan.hbs', 'ivan content')
        )
      );
    });

    test('./template2', () => {
      const template = new DirectoryMetaTemplate(import.meta.dir, 'template2');
      const output = template.renderToJson({
        persons: [
          { name: 'ivan', isMusician: true, song: 'strangers in the night' },
          { name: 'anatoliy', isMusician: false },
          { name: 'john', isMusician: true, song: 'venom' },
        ],
        title: 'list of musicians'
      });

      expect(output).toEqual(
        directory('template2',
          directory('ivan notes',
            file('strangers in the night.hbs', 'la-la-la!')
          ),
          directory('john notes',
            file('venom.hbs', 'la-la-la!')
          ),
          file('musicians.hbs', ''),
        ),
      );
    });
  });