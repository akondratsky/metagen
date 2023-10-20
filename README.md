# metagen

## Syntax
### Interpolation
Template
```
├── {name}.txt
└── report-{company}.md
```
Payload:
```json
{ "name": "Chris", "company": "Chresla" }
```
Output:
```
├── Chris.txt
└── report-Chresla.md
```


### Conditional inclusion
Template
```
├── {#includeif isValentineDay}postcard.txt
└── {#includeif isLovelyPerson}present.txt
```
Payload
```json
{ "isValentineDay": true, "isLovelyPerson": false }
```
Output:
```
└── postcard.txt
```

### Iterate values
Template
```
└── {#each person}.txt
```
Payload:
```json
{ "persons": ["alex", "john"]}
```
Output:
```
├── alex.txt
└── john.txt
```
### Iterate objects

Template
```
└── {#each persons}{name}{#includeif isMusician}.txt
```
Payload:
```json
{
  "persons": [
    { "name": "ivan", isMusician: true },
    { "name": "anatoliy", isMusician: false }
  ]
}
```
Output:
```
└── ivan.txt
```

### Templating
Files marked with flag `#hbs` will be rendered with `handlebars`.
Template
```├── {#hbs}{name}.txt
└── icon.txt
```
Payload:
```json
{ "name": "Chris" }
```
Output:
```├── Chris.txt
└── report-Chresla.md
```
File `Chris.txt` will be passed through handlebars templating engine, file `icon.png` will be copied directly.