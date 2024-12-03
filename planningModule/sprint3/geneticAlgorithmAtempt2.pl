
 
agenda_staff(d001,20241028,[(720,790,m01),(1080,1140,c01)]).
agenda_staff(d002,20241028,[(850,900,m02),(901,960,m02),(1380,1440,c02)]).
agenda_staff(d003,20241028,[(720,790,m01),(910,980,m02)]).
agenda_staff(d004,20241028,[(850,900,m02),(940,980,c04)]).
 
timetable(d001,20241028,(480,1200)).
timetable(d002,20241028,(500,1440)).
timetable(d003,20241028,(520,1320)).
timetable(d004,20241028,(620,1020)).
 
staff(d001,doctor,orthopaedist,[so2,so3,so4]).
staff(d002,doctor,orthopaedist,[so2,so3,so4]).
staff(d003,doctor,orthopaedist,[so2,so3,so4]).
staff(d004,doctor,orthopaedist,[so2,so3,so4]).


 
%surgery(SurgeryType,TAnesthesia,TSurgery,TCleaning).
 
surgery(so2,45,60,45).
surgery(so3,45,90,45).
surgery(so4,45,75,45).
 
 
surgery_id(so100001,so2).
surgery_id(so100002,so3).
surgery_id(so100003,so4).
surgery_id(so100004,so2).
surgery_id(so100005,so4).
%surgery_id(so100006,so2).
%surgery_id(so100007,so3).
%surgery_id(so100008,so2).
%surgery_id(so100009,so2).
%surgery_id(so100010,so2).
%surgery_id(so100011,so4).
%surgery_id(so100012,so2).
%surgery_id(so100013,so2).
 
assignment_surgery(so100001,d001).
assignment_surgery(so100002,d002).
assignment_surgery(so100003,d003).
assignment_surgery(so100004,d001).
assignment_surgery(so100004,d002).
assignment_surgery(so100005,d002).
assignment_surgery(so100005,d003).
%assignment_surgery(so100006,d001).
%assignment_surgery(so100007,d003).
%assignment_surgery(so100008,d004).
%ssignment_surgery(so100008,d003).
%assignment_surgery(so100009,d002).
%assignment_surgery(so100009,d004).
%assignment_surgery(so100010,d003).
%assignment_surgery(so100011,d001).
%assignment_surgery(so100012,d001).
%assignment_surgery(so100013,d004).
 
 
 
agenda_operation_room(or1,20241028,[(520,579,so100000),(1000,1059,so099999)]).

inicializa:-write('Numero de novas Geracoes: '),read(NovasGeracoes), 			(retract(geracoes(_));true), asserta(geracoes(NovasGeracoes)),
	write('Dimensao da Populacao: '),read(DimensaoPopulacao),
	(retract(populacao(_));true), asserta(populacao(DimesaoPopulacao)),
	write('Probabilidade de Cruzamento (%):'), read(Probabilidade1),
	ProbabilidadeCruzamento is Probabilidade1/100, 
	(retract(prob_cruzamento(_));true), 	asserta(prob_cruzamento(ProbabilidadeCruzamento)),
	write('Probabilidade de Mutacao (%):'), read(Probabilidade2),
	ProbabilidadeMutacao is Probabilidade2/100, 
	(retract(prob_mutacao(_));true), asserta(prob_mutacao(ProbabilidadeMutacao)).

 gera:-
	inicializa,
	gera_populacao(Populacao),
	write('Pop='),write(Populacao),nl,
	avalia_populacao(Populacao,PopAv),
	write('PopAv='),write(PopAv),nl,
	ordena_populacao(PopAv,PopulacaoOrdenada),
	geracoes(NovasGeracoes),
	gera_geracao(0,NovasGeracoes,PopulacaoOrdenada).

    gera_populacao(Populacao):-
	populacao(TamanhoPopulacao),
	tarefas(NumT),
	findall(Tarefa,tarefa(Tarefa,_,_,_),ListaTarefas),
	gera_populacao(TamanhoPopulacao,ListaTarefas,NumT,Pop).

gera_populacao(0,_,_,[]):-!.