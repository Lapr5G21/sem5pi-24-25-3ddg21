# US 1010 - As Customer Manager, I want to open or close phases of the process for a job opening. #

## 1. Context

This task is created to enable a Costumer Manager to switch the state of a Job Opening Process Phase, this function allows the user to maintain a live track of the present phase.
## 2. Requirements

 **US 1010**  As Customer Manager, I want to open or close phases of the process for a job opening.

**Acceptance Criteria:**

- 1010.1 - The user must be able to open or close phases moving to the next phase or returning phases.
- 1010.2 - Job Opening Process Phases must be sequential, only interview is optional.
- 1010.3 - When the result phase is marked as closed the Job Opening state must change.
- 1010.4 - The user must provide the job reference.


**Dependencies/References:**

> Q143 Francisco – US 1010 - Open or close phases of the process for a job opening. – Quando o Customer Manager deseja abrir ou fechar uma fase de recrutamento, este deve ter a oportunidade de escolher qual fase deseja abrir ou fechar, ou automaticamente ele avança para a próxima fase, isto é fecha a fase atual e abre a seguinte.


> A143 Já respondida em Q16. Mas, resumindo, a ideia desta US é permitir avançar nas fases de um job opening. As fases devem ser sempre sequenciais. Podemos considerar que o fecho de uma fase resulta na abertura da fase seguinte (e o avançar para a fase seguinte, significa fechar a anterior). Não deve ser possível “saltar” fases, a não ser fases que não façam parte do processo (por exemplo, se não tiver entrevistas).


> Q153 José – US 1010 - Na US 1010, considerando que quando fechamos uma fase a próxima começa, quando consideramos o caso de chegarmos á ultima fase, quando fecharmos a fase devemos também mudar o estado do job opening?

> A153 Ver Q151. Quanto à segunda questão, quando se fecha a última fase de um processo esse processo termina, ou seja, esse job opening já não está “activo”.


## 3. Analysis

![Domain Model Select Job Requirements](DM/Domain-Model-select-Requirements-specification.svg)

## 4. Design

### 4.1. Sequence Diagram

![Sequence Diagram Select Job Requirements](SD/sequence-diagram-select-RequirementsSpecification.svg)

### 4.2. Class Diagram

![Class Diagram Select Job Requirements](CD/class-diagram-select-Requirements-specification-Select_Job_Requirements_Class_Diagram.svg)

### 4.3. Applied Patterns

- 4.3.2. Factory
> Our PersistenceContext will create a RepositoryFactory then the RepositoryFactory will create the repository that we need in order to persist our domain entity, in this case the Job Opening and JobOpeningProcesses

- 4.3.3 Tell, Don't Ask
> Ensure that objects do not expose their internal state or behaviour to the outside world. On the contrary, objects should receive commands telling them what they should do, rather than being asked for information about their current state.


### 4.4. Tests

Include here the main tests used to validate the functionality. Focus on how they relate to the acceptance criteria.

**Test 1:** Test that Job Opening open and close process must be sequential

1. Create or verify the existence of "Job Openings".
2. Setup the job Opening phases.
3. Select the Switch Job Opening Phase option and choose to advance.
4. A actual state message should be shown.

**Test 2:** Ensure that when result phase is closed, Job Opening state is set as closed.

1. Create or verify the existence of "Job Openings".
2. Setup the job Opening phases.
3. Select the Switch Job Opening Phase option and choose to advance.
4. Repeat 3. until Result phase then advance.
5. When advancing at result phase, job opening state exchanged state must be shown.


