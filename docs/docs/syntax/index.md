# Syntax

Metagen uses its own syntax to define file and folder structure creation. It resembles the [Handlebars](https://handlebarsjs.com/guide/#simple-expressions) expressions, but is much simpler and shorter: editing folder names is the process, different from editing text files, and the simplification here is essential.

Expressions in Metagen are also called nodes, but they use single braces. In next example template name has two [interpolation nodes](/docs/syntax/interpolation):

```
{firstName} {lastName}.txt
```

Provided with the next payload, Metagen will render this meta template into the file with the name `John Public.txt`:

```json
{
  "firstName": "John",
  "lastName": "Public"
}
```

Read about the different nodes in Metagen in the following articles.