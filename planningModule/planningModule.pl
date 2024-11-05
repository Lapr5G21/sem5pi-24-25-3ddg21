
% definição dos predicados

:- discontiguous staff/4.
:- discontiguous availability/3.
:- discontiguous agenda_staff/3.
:- discontiguous agenda_staff1/3.
:- discontiguous agenda_operation_room/3.
:- discontiguous agenda_operation_room1/3.
:- discontiguous timetable/3.
:- discontiguous agenda_staff/4.



% staff(d001,doctor,orthopaedist,[so2,so3,so4]).
% Inserir um doutor com ID, ROLE, Specialty, Tipo de cirurgia. 

% timetable(d001,20241028,(480,1200)).
% Define o horario de trabalho para um dia , ID, dia, [hora de inicio - hora de fim]

% agenda_staff(d001,20241028,[(720,790,m01),(1080,1140,c01)]).
% Obtem a agenda de um staff para um determinado dia.

% surgery(SurgeryType,TAnesthesia,TSurgery,TCleaning).
% Insere  uma cirurgia com o tipo, tempo de anestesia, tempo de cirurgia, tempo de limpeza


% INSERIR  Tipos de CIRURGIA
% Tipo de cirurgia, tempo de anestesia, tempo de cirurgia, tempo de limpeza 
surgery(so2,45,60,45).
surgery(so3,45,90,45).
surgery(so4,45,75,45).


% INSERIR CIRURGIAS
% Associa um Tipo de cirurgia a um id de cirurgia
surgery_id(so100001,so2).
surgery_id(so100002,so3).
surgery_id(so100003,so4).
surgery_id(so100004,so2).
surgery_id(so100005,so4).


% INSERIR STAFFS 

% doctor 1 

staff(d001,doctor,orthopaedist,[so2,so3,so4]).
timetable(d001,20241028,(480,1200)).
agenda_staff(d001,20241028,[(720,790,m01),(1080,1140,c01)]).

% doctor 2

staff(d002,doctor,orthopaedist,[so2,so3,so4]).
timetable(d002,20241028,(500,1440)).
agenda_staff(d002,20241028,[(850,900,m02),(901,960,m02),(1380,1440,c02)]).


% doctor 3

staff(d003,doctor,orthopaedist,[so2,so3,so4]).
timetable(d003,20241028,(520,1320)).
agenda_staff(d003,20241028,[(720,790,m01),(910,980,m02)]).



% ASSOCIAR uma cirurgia a um Staff -> Doutor 

assignment_surgery(so100001,d001).
assignment_surgery(so100002,d002).
assignment_surgery(so100003,d003).
assignment_surgery(so100004,d001).
assignment_surgery(so100004,d002).
assignment_surgery(so100005,d002).
assignment_surgery(so100005,d003).


% COLOCAR UM APOINTMENT NUMA OR (operation Room) num determinado dia

agenda_operation_room(or1,20241028,[(520,579,so100000),(1000,1059,so099999)]).

% Procurar os tempos livres numa determinada agenda

free_agenda0([],[(0,1440)]).
free_agenda0([(0,Tfin,_)|LT],LT1):-!,free_agenda1([(0,Tfin,_)|LT],LT1).
free_agenda0([(Tin,Tfin,_)|LT],[(0,T1)|LT1]):- T1 is Tin-1,
    free_agenda1([(Tin,Tfin,_)|LT],LT1).

free_agenda1([(_,Tfin,_)],[(T1,1440)]):-Tfin\==1440,!,T1 is Tfin+1.
free_agenda1([(_,_,_)],[]).
free_agenda1([(_,T,_),(T1,Tfin2,_)|LT],LT1):-Tx is T+1,T1==Tx,!,
    free_agenda1([(T1,Tfin2,_)|LT],LT1).
free_agenda1([(_,Tfin1,_),(Tin2,Tfin2,_)|LT],[(T1,T2)|LT1]):-T1 is Tfin1+1,T2 is Tin2-1,
    free_agenda1([(Tin2,Tfin2,_)|LT],LT1).
