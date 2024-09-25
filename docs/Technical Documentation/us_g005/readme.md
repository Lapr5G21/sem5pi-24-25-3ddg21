# US G005

*As Project Manager, I want the team to add to the project the necessary scripts, so that build/executions/deployments/... can be executed effortlessly.*

## 1. Context

*This task aims to enhance the projects´s workflow by developing the necessary scripts to build,execute and deploy the app developed. With these scripts the efficiency and automation of the development will be improved.*

## 2. Requirements

The requirement is to integrate essential scripts into the project to facilitate effortless execution of build, execution, deployment, and related tasks.

**Acceptance Criteria:**

- G005.1 The necessary scripts to build, execute and deploy are added to the project.
- G005.2 The scripts have a full coverage on every app developed.
- G005.3 Every script is well documented for an easy new user use.

**Dependencies/References:**

*This requirement is alligned with the G001 where technical constrains and concerns of the project are defined.*

## 3. Analysis

*As required and in the team´s opinion that the scripts are a very positive addition to the project with important improvements in the automation process* 

## 4. Design

*In this sections, the team should present the solution design that was adopted to solve the requirement. This should include, at least, a diagram of the realization of the functionality (e.g., sequence diagram), a class diagram (presenting the classes that support the functionality), the identification and rational behind the applied design patterns and the specification of the main tests used to validade the functionality.*

### 4.1. Realization

*The scripts will be implemented using a modular approach, ensuring flexibility and ease of maintenance. They will be organized based on the app or aggregate of apps they perform, such as build, execution, and deployment a certain app or group/whole project.*

### 4.2. Class Diagram

*not applyed.*

### 4.3. Applied Patterns

*The team followed a pattern where there are scripts for each app, a execution for the whole project and quickbuild that skip tests and documentation processes.*

### 4.4. Tests

*The project is running at the local machines with the build-all.bat script created that covers the whole project application and test/documentation process as well. The individual build processes also work with a low elapsed time in each phase.
As a complement the Workflow also presents success experiments with low time of execution.*


## 5. Implementation

*The scripts are present in the projects folder, can be executed at IDE or other terminals of choice, Windows or Linux, these are the following scripts developed: *
Build and Run scripts:*
> build-all.bat (or .sh)

> quickbuild.bat (or .sh)

> rebuild-all.bat

> run-backoffice.bat

> run-candidate.bat

> run-customer.bat


## 6. Integration/Demonstration

> System Compatibility: The team ensures that the scripts are compatible with the current system architecture, frameworks, and dependencies. Compatibility testing is performed to verify smooth integration.

> Dependency Management: Any external dependencies required by the scripts are managed properly. This includes ensuring that the necessary libraries, tools, or configurations are in place for the scripts to function correctly.

> Script Invocation: Integration tests are conducted to verify that the scripts can be invoked from within the project environment without errors. This involves checking paths, permissions, and environment variables.

> Error Handling: Error handling mechanisms are implemented to gracefully manage any unexpected errors or exceptions that may occur during script execution. This ensures robustness and reliability.

## 7. Observations

*The scripts are running at local machines but the team is having java version building problems, where in some machines there are fails at processing certain plugins and refers to environment local machine java paths. Work on this is being developed along with teacher. With the functional machines we can make sure that there is a problem with the local machine and not with the scripts or project developed.*  