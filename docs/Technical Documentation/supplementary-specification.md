# Supplementary Specification 

## Programming Language
- The programming language to be used in the project is Java. However, other languages can be used.

"NFR01 - Programming language The solution should be implemented using Java as the main language. Other languages can be used in accordance with more specification requirements."

## Documentation
- In the folder docs we have all the process documented(analysis,design,testing) and the domain model.

"NFR02 - Technical Documentation Project documentation should be always available on the project repository ("docs" folder, markdown format) and, when applicable, in
accordance to the UML notation. The development process of every US (e.g.: analysis, design, testing, etc.) must be reported (as part of the documentation)."

## Testing
- In this project we adopt a test-driven-development approach.

"NFR03 - Test-driven development The team should develop a relevant set of automated tests for every US / Class / Method. The team should aim to adopt a test-driven
development approach."

## Github
- All the source code and the documentation are versioned in the GitHub repository.

"NFR04 - Source Control The source code of the solution as well as all the documentation and related artifacts should be versioned in a GitHub repository to be provided
to the students. Only the main (master/main) branch will be used (e.g., as a source for releases)."

- The GitHub repository will provide night builds to follow the evolution of the project.

"NFR05 - Continuous Integration The Github repository will provide night builds with publishing of results and metrics."

## Development

-  The repository includes scripts to run the programs (Windows and Linux). And also includes a read.md in the main folder.

"NFR06 - Deployment and Scripts The repository should include the necessary scripts to build and deploy the solution in a variety of systems (at least Linux and Windows). It
should also include a readme.md file in the root folder explaining how to build, deploy and execute the solution."

- The system must support the data persistence in "memory" and in a relation database.

"NFR07 - Database By configuration, the system must support that data persistence is done either "in memory" or in a relational database (RDB). Although in-memory"
database solutions can be used during development and testing, the solution must include a final deployment where a persistent relational database is used. The system
should have the ability to initialize some default data."

## Authentication
- The system supports authentication and authorization for all the users.

"• NFR08 - Authentication and Authorization The system must support and apply authentication and authorization for all its users and functionalities."
