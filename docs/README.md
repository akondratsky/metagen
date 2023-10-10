- DirectoryNode `person {#each persons}{name}_{surname}`
  - ArrayNode payload.persons
    - DirectoryNode `person {name}_{surname}`
      - ExtrapolationNode
      - TextNode
      - ExtrapolationNode
    - DirectoryNode `person {name}_{surname}`
      - ExtrapolationNode
      - TextNode
      - ExtrapolationNode
- FileNode {#include isList}list.ts
  - ConditionNode list.ts
- FileNode index.ts

1. Перечисляем все файлы, создаем из них DirectoryNode и FileNode
2. Проходимся по всем нодам

Проход по ноде:
1. Проверяем текущий узел
2. Узел текстовый - добавляем в список узлов
