# US 5.1.18

As a Doctor, I want to remove an operation requisition, so that the healthcare activities are provided as necessary. 

## 2. Requirements


**US 5.1.18** As a Doctor, I want to remove an operation requisition, so that the healthcare activities are provided as necessary. 


**Acceptance Criteria:**

- 5.1.18.1 - Doctors can delete operation requests they created if the operation has not yet been scheduled. 

- 5.1.18.2 -  A confirmation prompt is displayed before deletion. 

- 5.1.18.3 - Once deleted, the operation request is removed from the patient’s medical record and cannot be recovered. 

- 5.1.18.4 - The system notifies the Planning Module and updates any schedules that were relying on this request. 

## 3. Views

The global views are available in the views folder. 

### LEVEL 1

![level1_view](views/level1/process-view.png)

### LEVEL 2

![level2_view](views/level2/process-view.png)

### LEVEL 3
![level3_view](views/level3/process-view1.png)

![level3_view2](views/level3/process-view2.png)




### 4.4. Tests

Include here the main tests used to validate the functionality. Focus on how they relate to the acceptance criteria.

**Test 1:** *Verifies that it is not possible to ...*

**Refers to Acceptance Criteria:** G002.1


```
@Test(expected = IllegalArgumentException.class)
public void ensureXxxxYyyy() {
	...
}
````

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