# US 5.1.6

As a (non-authenticated) Backoffice User, I want to log in to the system using my
credentials, so that I can access the backoffice features according to my assigned
role



## 2. Requirements

**US 5.1.6** As a (non-authenticated) Backoffice User, I want to log in to the system using my
credentials, so that I can access the backoffice features according to my assigned
role


**Acceptance Criteria:**

- 5.1.6.1 - Backoffice users log in using their username and password.

- 5.1.6.2 -  Role-based access control ensures that users only have access to features appropriate to their
role (e.g., doctors can manage appointments, admins can manage users and settings).

- 5.1.6.3 - After five failed login attempts, the user account is temporarily locked, and a notification is
sent to the admin.

- 5.1.6.4 - Login sessions expire after a period of inactivity to ensure security.

## 3. Views

The global views are available in the views folder. 

### LEVEL 1

![level1_view](views/level1/process-view.png)

### LEVEL 2

![level2_view](views/level2/process-view.png)

### LEVEL 3

![level3_view](views/level3/process-view1.png)

![level3_view](views/level3/process-view2.png)



## 4. Design

*In this sections, the team should present the solution design that was adopted to solve the requirement. This should include, at least, a diagram of the realization of the functionality (e.g., sequence diagram), a class diagram (presenting the classes that support the functionality), the identification and rational behind the applied design patterns and the specification of the main tests used to validade the functionality.*

### 4.1. Realization

### 4.2. Class Diagram

![a class diagram](class-diagram-01.svg "A Class Diagram")

### 4.3. Applied Patterns

### 4.4. Tests

Include here the main tests used to validate the functionality. Focus on how they relate to the acceptance criteria.

**Test 1:** *Verifies that it is not possible to ...*

**Refers to Acceptance Criteria:** 


```
@Test(expected = IllegalArgumentException.class)
public void ensureXxxxYyyy() {
    ...
}
```

## 5. Implementation

*In this section the team should present, if necessary, some evidencies that the implementation is according to the design. It should also describe and explain other important artifacts necessary to fully understand the implementation like, for instance, configuration files.*

*It is also a best practice to include a listing (with a brief summary) of the major commits regarding this requirement.*

## 6. Integration/Demonstration

*In this section the team should describe the efforts realized in order to integrate this functionality with the other parts/components of the system*

*It is also important to explain any scripts or instructions required to execute an demonstrate this functionality*

## 7. Observations

*This section should be used to include any content that does not fit any of the previous sections.*

*The team should present here, for instance, a critical prespective on the developed work including the analysis of alternative solutioons or related works*

*The team should include in this section statements/references regarding third party works that were used in the development this work.*