#  node-api-with-hapijs-cosmosdb-getting-started
Node project starter template with hapi.js, azure-cosmos-db, typescript, eslint and hot-reload package.

## Packages Used
* Hapi.js: web framework
* Azure Cosmos DB
* Eslist: to check code standard.
* nodemon: to hot reload code changes at development time.


## Azure Cosmos DB Concepts
* Creation Hierarchy: create db-account > then create db > then create containers.
* Containers are the name of collection of documents, like tables.
* When there's more than one container, a partiion key must be assigned. Which will then be used to distribute data across multiple partiions (servers?). A Partition key is a field name of that container/document, like id, country, city etc. Partition key can be nested, like "/country/city"; based on this nesting, data partitioning will happen, when needed.
* When creating database, you can fix dedicated RU for each container. Like if your database has 2000 RU/s purchased, you can distribute that RU to all the containers so that a minimum RU will be allocated for those container, for smooth read/write. So that a high read/write in container will not affect another container. In that case, a container must be assigned minimum of 400 RU/s.  
  Also you can create database without fixing RU for containers, and total RU will be shared accross all containers.



## Notes
### Note about getting rid of semicolon (;)
Javascript has this ability. Without an extra syntax, code will be cleaner (think about the cleanness of Python code). Let's use it and see how does it feel.

### To run a npm package command directly from command. For example
  ```
  node_modules\\.bin\\eslint .
  ```
  But when added in `npm script`, full path is not needed.  
  N.b. if full path command is not working, check your command line application, try using simple command line/shell application.



## Frequently shooted troubles (troubleshooting)
### Trouble: eslint error *Require statement not part of import statement.*
On code `require('something')`.

**Shoot**: add rules to your .eslintrc.json (or whatever file type you are using).

```json
"rules": {
 "@typescript-eslint/no-var-requires": "off"
}
```

### Trouble: Eslist error: *Failed to load plugin '@typescript-eslint' declared in '.eslintrc.json': Cannot find module 'typescript'*
**Shoot**: Install typescript globally or as a dev-dependency. Not sure why *typescript* was not included as a dependency in  *typescript-eslint*!



## Eslint configuration steps
* **How would you like to use Eslint?**  
  *To check syntax, find problems, and enforce code style.*  
* **Typpes of modules your project use?**  
  *CommonJs*  
* **JS framework?** (React? vue?)  
  *None*  
* **Typescript?**  
  *No*  
* **Where does your code run?**  
  *Node*  
* **Define styles for you project:**  
  *Answer questions about you style*  
* **What format do you want your config file to be in?**  
  *Json*  
* **What style of indentation do you use?**  
  *Space*  
* **What quotes do you use for strings?**  
  *single*  
* **What line endings do you use?**  
  *windows*  
* **Would you like to install them now?**  
  *Yes*  
* **Which package manager do you want to use?**  
  *npm*
