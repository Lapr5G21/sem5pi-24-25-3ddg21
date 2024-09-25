# US 1000

## 1. Context

*US 1000 - As an administrator, I want to be able to register, disable/enable, and list users of the backoffice.*

## 2. Requirements

In this file, we are going to regard the part of enabling users of the backoffice

*Example*

**US 1000** As an administrator, I want to be able to enable users of the backoffice.

**Acceptance Criteria:**

- 1000.1. One user can be enabled/disabled more than one time.
- 1000.2. The system should only list the deactivated users.

**Dependencies/References:**
>Question : Multiple enable/disable (US1000) – Can a user (from the backoffice, for example) be enabled/disabled multiple times?

>Answer : Yes.
## 3. Analysis

![EnableBackofficeUser Domain Model](DM/domain-model-enable-backoffice-user.svg)

## 4. Design

*In this sections, we present the solution design that was adopted to solve the requirement

### 4.1. Realization

![EnableBackofficeUser Sequence Diagram](SD/sequence-diagram-enable-backoffice-user.svg)

### 4.2. Class Diagram

![EnableBackofficeUser Class Diagram](CD/class-diagram-enable-backoffice-user.svg)

### 4.3. Applied Patterns
- 4.3.1. Factory
> Our PersistenceContext will create a RepositoryFactory then the RepositoryFactory will create the repository that we need in order to persist our domain entity, in this case the User

- 4.3.2 Service
> Services are operations with the responsibility of an entity or value object. They are used to model operations that involve multiple objects or complex behaviour.

- 4.3.3 Tell, Don't Ask
> Ensure that objects do not expose their internal state or behaviour to the outside world. On the contrary, objects should receive commands telling them what they should do, rather than being asked for information about their current state.

- 4.3.6 Model-View-Controller (MVC)
> Model is responsible for managing the data and business logic of the application. (UserManagementService, AuthorizationService)
> View is responsible for presenting the data to the user in a human-readable format. (ActivateBackofficeUserUI)
> Controller is responsible for handling the user input and updating the model and the view accordingly. (ActivateBackofficeUserController)

### 4.4. Tests

## 5. Implementation
**ActivateBackofficeUserController**

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

import eapli.jobs4u.usermanagement.domain.Jobs4uRoles;
import eapli.framework.application.UseCaseController;
import eapli.framework.infrastructure.authz.application.AuthorizationService;
import eapli.framework.infrastructure.authz.application.AuthzRegistry;
import eapli.framework.infrastructure.authz.application.UserManagementService;
import eapli.framework.infrastructure.authz.domain.model.SystemUser;

import java.util.ArrayList;
import java.util.List;

/**
 * author Bruno 1221352
 */

@UseCaseController
public class ActivateBackofficeUserController {

    private final AuthorizationService authz = AuthzRegistry.authorizationService();
    private final UserManagementService userSvc = AuthzRegistry.userService();

    public Iterable<SystemUser> deactivatedBackofficeUsers() {
        authz.ensureAuthenticatedUserHasAnyOf(Jobs4uRoles.POWER_USER, Jobs4uRoles.ADMIN);
        Iterable<SystemUser> allDeactivatedUsers = userSvc.deactivatedUsers();
        return filterBackofficeUsers(allDeactivatedUsers);
    }

    private Iterable<SystemUser> filterBackofficeUsers(Iterable<SystemUser> allUsers) {
        List<SystemUser> backofficeUsers = new ArrayList<>();
        for (SystemUser user : allUsers) {
            if (user.hasAny(Jobs4uRoles.ADMIN,Jobs4uRoles.OPERATOR,Jobs4uRoles.CUSTOMER_MANAGER,Jobs4uRoles.LANG_ENGINEER)) {
                backofficeUsers.add(user);
            }
        }
        return backofficeUsers;
    }

    public SystemUser activateUser(final SystemUser user) {
        authz.ensureAuthenticatedUserHasAnyOf(Jobs4uRoles.POWER_USER, Jobs4uRoles.ADMIN);
        return userSvc.activateUser(user);
    }
}
````

**ActivateBackofficeUserUI**

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

import eapli.jobs4u.usermanagement.domain.Jobs4uRoles;
import eapli.framework.application.UseCaseController;
import eapli.framework.infrastructure.authz.application.AuthorizationService;
import eapli.framework.infrastructure.authz.application.AuthzRegistry;
import eapli.framework.infrastructure.authz.application.UserManagementService;
import eapli.framework.infrastructure.authz.domain.model.SystemUser;

import java.util.ArrayList;
import java.util.List;

/**
 * author Bruno 1221352
 */

@UseCaseController
public class ActivateBackofficeUserController {

    private final AuthorizationService authz = AuthzRegistry.authorizationService();
    private final UserManagementService userSvc = AuthzRegistry.userService();

    public Iterable<SystemUser> deactivatedBackofficeUsers() {
        authz.ensureAuthenticatedUserHasAnyOf(Jobs4uRoles.POWER_USER, Jobs4uRoles.ADMIN);
        Iterable<SystemUser> allDeactivatedUsers = userSvc.deactivatedUsers();
        return filterBackofficeUsers(allDeactivatedUsers);
    }

    private Iterable<SystemUser> filterBackofficeUsers(Iterable<SystemUser> allUsers) {
        List<SystemUser> backofficeUsers = new ArrayList<>();
        for (SystemUser user : allUsers) {
            if (user.hasAny(Jobs4uRoles.ADMIN,Jobs4uRoles.OPERATOR,Jobs4uRoles.CUSTOMER_MANAGER,Jobs4uRoles.LANG_ENGINEER)) {
                backofficeUsers.add(user);
            }
        }
        return backofficeUsers;
    }

    public SystemUser activateUser(final SystemUser user) {
        authz.ensureAuthenticatedUserHasAnyOf(Jobs4uRoles.POWER_USER, Jobs4uRoles.ADMIN);
        return userSvc.activateUser(user);
    }
}

````
## 6. Integration/Demonstration

````
+= Base [ @poweruser ] ========================================================+

| 1. My account > | 2. Backoffice Users > | 4. Settings > | 0. Exit | 
Please choose an option
2

>> Backoffice Users >
1. Register Backoffice User
2. List all Backoffice Users
3. Deactivate Backoffice User
4. Activate Backoffice User
5. Accept/Refuse Signup Request
0. Return 

Please choose an option
4

+= Activate User ==============================================================+

SELECT User to activate

Nº:   Email                         Firstname                     Lastname                      Roles                         
1     tiagosilva@gmail.com          Tiago                         Silva                         [OPERATOR]                    
Enter user nº to activate or 0 to finish 
1
Backoffice User successfully activated.
+==============================================================================+
````
## 7. Observations

*This section should be used to include any content that does not fit any of the previous sections.*

*The team should present here, for instance, a critical prespective on the developed work including the analysis of alternative solutioons or related works*

*The team should include in this section statements/references regarding third party works that were used in the development this work.*