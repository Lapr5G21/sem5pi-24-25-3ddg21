# US 1000

## 1. Context

*US 1000 - As an administrator, I want to be able to register, disable/enable, and list users of the backoffice.*

## 2. Requirements

In this file, we are going to regard the part of listing users of the backoffice

*Example*

**US 1000** As an administrator, I want to be able to list users of the backoffice.

**Acceptance Criteria:**

- 1000.1. The system should display the name, the email and the role.

**Dependencies/References:**

## 3. Analysis

![ListBackofficeUser Domain Model](DM/domain-model-list-backoffice-user.svg)

## 4. Design

*In this sections, we present the solution design that was adopted to solve the requirement

### 4.1. Realization

![ListBackofficeUsers Sequence Diagram](SD/sequence-diagram-list-backoffice-user.svg)

### 4.2. Class Diagram

![ListBackofficeUsers Class Diagram](CD/class-diagram-list-backoffice-user.svg)

### 4.3. Applied Patterns
- 4.3.1. Factory
> Our PersistenceContext will create a RepositoryFactory then the RepositoryFactory will create the repository that we need in order to persist our domain entity, in this case the User

- 4.3.2 Service
> Services are operations with the responsibility of an entity or value object. They are used to model operations that involve multiple objects or complex behaviour.

- 4.3.3 Tell, Don't Ask
> Ensure that objects do not expose their internal state or behaviour to the outside world. On the contrary, objects should receive commands telling them what they should do, rather than being asked for information about their current state.

- 4.3.6 Model-View-Controller (MVC)
> Model is responsible for managing the data and business logic of the application. (UserManagementService, AuthorizationService)
> View is responsible for presenting the data to the user in a human-readable format. (ListBackofficeUsersUI)
> Controller is responsible for handling the user input and updating the model and the view accordingly. (ListBackofficeUsersController)

### 4.4. Tests

## 5. Implementation

**ListBackofficeUsersController**

````
/*
 * Copyright (c) 2013-2024 the original author or authors.
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
package eapli.jobs4u.usermanagement.application;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import eapli.jobs4u.usermanagement.domain.Jobs4uRoles;
import eapli.framework.application.UseCaseController;
import eapli.framework.infrastructure.authz.application.AuthorizationService;
import eapli.framework.infrastructure.authz.application.AuthzRegistry;
import eapli.framework.infrastructure.authz.application.UserManagementService;
import eapli.framework.infrastructure.authz.domain.model.SystemUser;
import eapli.framework.infrastructure.authz.domain.model.Username;

/**
 *
 * @author Bruno 1221352
 */
@UseCaseController
public class ListBackofficeUsersController {

    private final AuthorizationService authz = AuthzRegistry.authorizationService();
    private final UserManagementService userSvc = AuthzRegistry.userService();

    /**
     * This method returns backoffice users
     * @return backofficeUsers
     */
    public Iterable<SystemUser> backofficeUsers() {
        authz.ensureAuthenticatedUserHasAnyOf(Jobs4uRoles.POWER_USER, Jobs4uRoles.ADMIN);
        Iterable<SystemUser> allUsers = userSvc.allUsers();
        return filterBackofficeUsers(allUsers);
    }

    /**
     * This method filters only backoffice users
     * @param allUsers allUsers
     * @return backoffice Users
     */
    public Iterable<SystemUser> filterBackofficeUsers(Iterable<SystemUser> allUsers) {
        List<SystemUser> backofficeUsers = new ArrayList<>();
        for (SystemUser user : allUsers) {
            if (user.hasAny(Jobs4uRoles.ADMIN,Jobs4uRoles.OPERATOR,Jobs4uRoles.CUSTOMER_MANAGER,Jobs4uRoles.LANG_ENGINEER)) {
                backofficeUsers.add(user);
            }
        }
        return backofficeUsers;
    }
    public Optional<SystemUser> find(final Username u) {
        return userSvc.userOfIdentity(u);
    }
}

````

**ListBackofficeUsersUI**

````
/*
 * Copyright (c) 2013-2024 the original author or authors.
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
package eapli.jobs4u.app.backoffice.console.presentation.authz;

import eapli.jobs4u.usermanagement.application.ListBackofficeUsersController;
import eapli.framework.infrastructure.authz.domain.model.SystemUser;
import eapli.framework.presentation.console.AbstractListUI;
import eapli.framework.visitor.Visitor;

/**
 *
 * @author Bruno 1221352
 */
@SuppressWarnings({ "squid:S106" })
public class ListBackofficeUsersUI extends AbstractListUI<SystemUser> {
    private ListBackofficeUsersController theController = new ListBackofficeUsersController();

    @Override
    public String headline() {
        return "List Users";
    }

    @Override
    protected String emptyMessage() {
        return "No data.";
    }

    @Override
    protected Iterable<SystemUser> elements() {
        return theController.backofficeUsers();
    }

    @Override
    protected Visitor<SystemUser> elementPrinter() {
        return new SystemUserPrinter();
    }

    @Override
    protected String elementName() {
        return "User";
    }

    @Override
    protected String listHeader() {
        return String.format("#  %-30s%-30s%-30s%-30s%-10s%n", "EMAIL", "F. NAME", "L. NAME","ROLES","STATUS");
    }

}
````
## 6. Integration/Demonstration

````
>> Backoffice Users >
1. Register Backoffice User
2. List all Backoffice Users
3. Deactivate Backoffice User
4. Activate Backoffice User
5. Accept/Refuse Signup Request
0. Return 

Please choose an option
2

+= List Users =================================================================+

#  EMAIL                         F. NAME                       L. NAME                       ROLES                         STATUS    

1. jane.doe@email.local          Jane                          Doe Admin                     [ADMIN]                       Activated 

2. bruno@gmail.com               Bruno                         Ribeiro                       [ADMIN]                       Activated 

3. tiagosilva@gmail.com          Tiago                         Silva                         [OPERATOR]                    Activated 

4. rogerio@gmail.com             Rogério                       Gomes                         [LANG_ENGINEER]               Activated 

5. conceicao@gmail.com           Sergio                        Conceicao                     [CUSTOMER_MANAGER, ADMIN]     Activated 

6. bruno123@gmail.com            Bruno                         Ribeiro                       [OPERATOR]                    Activated 

+==============================================================================+

````