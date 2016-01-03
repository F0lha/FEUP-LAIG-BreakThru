
:-use_module(library(between)).
:-use_module(library(lists)).
:-use_module(library(random)).

%%% Jogador Amarelo = 0 %%%
%%% Jogador Cinzento = 1 %%%

initial_board(
	[[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,1,1,1,1,1,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,1,0,0,2,2,2,0,0,1,0],	
	[0,1,0,2,0,0,0,2,0,1,0],
	[0,1,0,2,0,5,0,2,0,1,0],	
	[0,1,0,2,0,0,0,2,0,1,0],
	[0,1,0,0,2,2,2,0,0,1,0],
	[0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,1,1,1,1,1,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0]]).
	
	
%%%% MENUS %%%%

playMenu:-nl,
nl,
write('1 - HUM(Y) - HUM(G) '),nl,
write('2 - HUM(Y) - PC(G) '),nl,
write('3 -  PC(Y) - HUM(G) '),nl,
write('4 -  PC(Y) - PC(G) '),nl,
write('5 - Back '), nl,
read(Answer), playMenuAnswer(Answer).

playMenuAnswer(1):-initial_board(Board), playFirst(Board,0,0),!,menu.
playMenuAnswer(2):-initial_board(Board), playFirst(Board,0,1),!,menu.
playMenuAnswer(3):-initial_board(Board), playFirst(Board,1,0),!,menu.
playMenuAnswer(4):-initial_board(Board), playFirst(Board,1,1),!,menu.
playMenuAnswer(5):-!,menu.
playMenuAnswer(_):-write('Wrong Input'),nl,nl,!,playMenu.

menu:- nl, write('Bem Vindo ao BreakThru'),nl,
nl,
write('1 - Play '),nl,
write('2 - Credits '),nl,
write('3 - Exit '),nl,
read(Answer), menuAnswer(Answer).

menuAnswer(1):-playMenu.
menuAnswer(2):-credits,!,menu.
menuAnswer(3):-!.
menuAnswer(_):-write('Wrong Input'),nl,nl,!,menu.

credits:-nl, write('Game made by Joao Baiao and Pedro Castro'),nl, nl.

%%%%%%%%%%%%%%%%%%% Play Validation %%%%%%%%%%%%%%%%%%%%%%%

%inLine(Board,X,Y,XF,YF).

inLine(Board,X,Y,XF,YF):-(X =:= XF, YF >= Y,Low is Y + 1,High is YF, between(Low,High,Index),matrixGet(Board,X,Index,Value),((Value =\= 0,!,fail);(Index =:=High,!)));
							(X =:= XF, Y > YF,Low is YF,High is Y - 1, between(Low,High,Index),matrixGet(Board,X,Index,Value),((Value =\= 0,!,fail);(Index =:=High,!)));
							(Y =:= YF, XF >= X, Low is X + 1,High is XF, between(Low,High,Index),matrixGet(Board,Index,Y,Value),((Value =\= 0,!,fail);(Index =:=High,!)));
							(Y =:= YF,X > XF, Low is XF,High is X - 1, between(Low,High,Index),matrixGet(Board,Index,Y,Value),((Value =\= 0,!,fail);(Index =:=High,!))).
												
%getDiagonals(X,Y,XF,YF).
												 
getDiagonals(X,Y,XF,YF):-findall(XF-YF,diagonal(X,Y,XF,YF),List),member(XF-YF,List).				
							
%diagonal(X,Y,XF,YF).

diagonal(X,Y,XF,YF):-XT is X + 1, XB is X - 1,YT is Y + 1, YB is Y - 1,(
					(XT < 12,YT < 12, XF is XT, YF is YT);
					(XB > 0,YT < 12,XF is XB, YF is YT);
					(XT < 12,YB > 0,XF is XT, YF is YB);
					(XB > 0,YB > 0,XF is XB, YF is YB)).

%validMove(Board,X,Y,XF,YF,Player,Cost,NewCost).

validMove(Board,X,Y,XF,YF,Player,Cost,NewCost):-((getDiagonals(X,Y,XF,YF),playerCost(Board,XF,YF,Player2,_), Player2 =\= -1,Player=\=Player2,matrixGet(Board,X,Y,Value),((Value=:= 5, MoreValue is 0);(MoreValue is 1)));
											(inLine(Board,X,Y,XF,YF), MoreValue is 0)),checkCost(Cost,MoreValue,NewCost),!.

%continueGame(Board).

continueGame(Board):- whereM(Board,_,_), \+(isOnEdge(Board)),!.

%isOnEdge(Board). Checks if the MotherBoard is at the edge of the board

isOnEdge(Board):-whereM(Board,X,Y),((X =:= 1);(X=:=11);(Y=:=1);(Y=:=11)).

%%%%%%%%%%%%%%%%%% Piece Movement %%%%%%%%%%%%%%%%%%%%%%%%

%chooseBotDifficulty(Dif,N).
chooseBotDifficulty(Dif,0):-nl,write('Choose Difficulty for Yellow Bot :'),nl,write('1 - Random'),nl,write('2 - Random with CheckMate'),nl,write('3 - Hard'),nl,write('4 - Hardest (Dev Mode)'),nl, read(Dif),(Dif=:=1;Dif=:=2;Dif=:=3;Dif=:=4).
chooseBotDifficulty(Dif,1):-nl,write('Choose Difficulty for Gray Bot :'),nl,write('1 - Random'),nl,write('2 - Random with CheckMate'),nl,write('3 - Hard'),nl,write('4 - Hardest (Dev Mode)'),nl, read(Dif),(Dif=:=1;Dif=:=2;Dif=:=3;Dif=:=4).
chooseBotDifficulty(Dif,N):-write('Input error, Try again'),nl,chooseBotDifficulty(Dif,N).

%playFirst(Board,Robot,Robot).

playFirst(Board,0,0):-printTable(Board,0,0),play(Board,0,0,0,0,0).
playFirst(Board,0,1):-chooseBotDifficulty(Dif,1),printTable(Board,0,0),play(Board,0,0,1,0,Dif).
playFirst(Board,1,0):-chooseBotDifficulty(Dif,0),play(Board,0,1,0,Dif,0).
playFirst(Board,1,1):-chooseBotDifficulty(Dif1,0),chooseBotDifficulty(Dif2,1),play(Board,0,1,1,Dif1,Dif2).

%play(Board,CurrPlayer,Bot1,Bot2,Level1,Level2). 

play(Board,0,Bot1,Bot2,Level1,Level2):-continueGame(Board), whoPlays(Board,0,NewBoard,Bot1,Bot2,Level1,Level2),!,play(NewBoard,1,Bot1,Bot2,Level1,Level2).
play(Board,1,Bot1,Bot2,Level1,Level2):-continueGame(Board), whoPlays(Board,1,NewBoard,Bot1,Bot2,Level1,Level2),!,play(NewBoard,0,Bot1,Bot2,Level1,Level2).

play(_,0,_,_,_,_):-write('Gray Player Won!'),nl.
play(_,1,_,_,_,_):-write('Yellow Player Won!'),nl.

%whoPlays(Board,Player,NewBoard,Bot1,Bot2,Level1,Level2).

whoPlays(Board,0,NewBoard,0,_,_,_):-chooseMove(Board,0,NewBoard,2).
whoPlays(Board,1,NewBoard,_,0,_,_):-chooseMove(Board,1,NewBoard,2).
whoPlays(Board,0,NewBoard,1,_,1,_):-playRandomMove(Board,0,NewBoard,2).
whoPlays(Board,1,NewBoard,_,1,_,1):-playRandomMove(Board,1,NewBoard,2).
whoPlays(Board,0,NewBoard,1,_,2,_):-playRandomMoveWithEnd(Board,0,NewBoard,2).
whoPlays(Board,1,NewBoard,_,1,_,2):-playRandomMoveWithEnd(Board,1,NewBoard,2).
whoPlays(Board,0,NewBoard,1,_,3,_):-playBestMove(Board,0,NewBoard,2).
whoPlays(Board,1,NewBoard,_,1,_,3):-playBestMove(Board,1,NewBoard,2).
whoPlays(Board,0,NewBoard,1,_,4,_):-playBestMoveUpdated(Board,0,NewBoard).
whoPlays(Board,1,NewBoard,_,1,_,4):-playBestMoveUpdated(Board,1,NewBoard).

%canUseThisPiece(Board,X,Y,Player,CostLeft,NewCost).

canUseThisPiece(Board,X,Y,Player,CostLeft,NewCost):-playerCost(Board,X,Y,RightPlayer,Diff),checkCost(CostLeft,Diff,NewCost),RightPlayer =:= Player,!.

%chooseMove(Board,Player,NewBoard,CostLeft)

chooseMove(Board,_,Board,0).
chooseMove(Board,Player,NewBoard,CostLeft):- write('What piece do you want to move? Jogador '),((Player =:= 0, write('Yellow'));(Player =:= 1,write('Gray'))),write(' with '),write(CostLeft),write(' Plays:')
										,nl,write('X = '), read(X),nl, write('Y = '), read(Y),nl,
										canUseThisPiece(Board,X,Y,Player,CostLeft,NewCost),
										write('New X = '), read(XF),nl, write('New Y = '),read(YF),nl,
										validMove(Board,X,Y,XF,YF,Player,NewCost,NewestCost), 
										movePiece(Board,X,Y,XF,YF,NewBoard2),
										printTable(NewBoard2,XF,YF),
										chooseMove(NewBoard2,Player,NewBoard,NewestCost),!.
										
chooseMove(Board,Player,NewBoard,CostLeft):-write('Impossivle Play'),nl,nl,chooseMove(Board,Player,NewBoard,CostLeft),!.

checkCost(CostLeft,Cost,NewCost):-Cost =< CostLeft, NewCost is (CostLeft-Cost),!.

playerCost(Board,X,Y,0,1):- matrixGet(Board,X,Y,Value), Value =:= 2,!.
playerCost(Board,X,Y,0,2):- matrixGet(Board,X,Y,Value), Value =:= 5,!.
playerCost(Board,X,Y,1,1):- matrixGet(Board,X,Y,Value), Value =:= 1,!.
playerCost(_,_,_,-1,0).

movePiece(Board,X,Y,XF,YF,NewBoard):-matrixGet(Board,X,Y,Value),defineSpace(Board,X,Y,0,TempBoard),defineSpace(TempBoard,XF,YF,Value,NewBoard).

%setList(List,Index,Value,NewList). 

setList([_|Rest],1,Value,[Value|Rest]):-!.

setList([X|Rest],Index,Value,[X|NewRest]):- NewIndex is Index - 1,setList(Rest,NewIndex,Value,NewRest).

%defineSpace(Board,X,Y,Value,NewBoard).

defineSpace(Board,X,Y,Value,NewBoard):-getLine(Board,Y,Line),setList(Line,X,Value,NewLine),setList(Board,Y,NewLine,NewBoard),!.

%%%%%%%%%%%%%%%%%%%%% Aux Functions   %%%%%%%%%%%%%%%%%%%%%%%%%


%whereM(Board,X,Y).

whereM(Board,X,Y):-between(1,11,IndexY),getLine(Board,IndexY,Line),nth1(IndexX,Line,5),X is IndexX,Y is IndexY,!.

%getLine(Board,Y,Line).

getLine(Board,Y,Line):-nth1(Y,Board,Line).

%matrixGet(Board,X,Y,Value).

matrixGet(Board,X,Y,Value):-nth1(Y,Board,List),nth1(X,List,Value).

%%%%%%%%%%%%%%%%%%%%%%%%%   BOT   %%%%%%%%%%%%%%%%%%%%%%%

%getBestMove(Board,Player,X,Y,YF,CostToSpend).

getBestMove(Board,Player,X,Y,XF,YF,CostLeft,CostToSpend):-listAllPossibleMoves(Board,Player,CostLeft,L),random_permutation(L,List),evaluate_and_choose(List,Board,Player,(_,-10000),X-Y-XF-YF-CostToSpend).

%evaluate_and_choose  Based on the Art of Prolog original predicate

evaluate_and_choose([],_,_,(Move,_),Move).

evaluate_and_choose([X-Y-XF-YF-CostToSpend | ListMoves] ,Board, Player ,Record, BestMove):-
				movePiece(Board,X,Y,XF,YF,NewBoard),
				evaluateBoard(NewBoard,Player,Value),
				updateBestMove(X-Y-XF-YF-CostToSpend, Value, Record, Record1),
				evaluate_and_choose(ListMoves,Board,Player,Record1,BestMove).


%getBestMoveUpdated(Board,Player,X,Y,YF,CostToSpend).

getBestMoveUpdated(Board,Player,Moves):-	listAllPossibleMoves(Board,Player,2,L),random_permutation(L,List),
											write('Number of Possible Plays : '),length(List,N),write(N),nl,
											evaluate_and_chooseUpdated(List,Board,Player,(_,-10000),Moves),
											statistics('runtime',Value), write('RunTime : '), write(Value),nl.

%evaluate_and_chooseUpdated  Based on the Art of Prolog predicate with a minor change that allows the bot to see a play ahead of its own because
%						in one turn two moves can be made. With this change the bot is able to make a play knowing he can make two moves.

evaluate_and_chooseUpdated([],_,_,(Move,Value),(Move,Value)):-!.

evaluate_and_chooseUpdated([X-Y-XF-YF-0 | ListMoves] ,Board, Player ,Record, BestMove):-
				movePiece(Board,X,Y,XF,YF,NewBoard),
				evaluateBoard(NewBoard,Player,Value),
				updateBestMove([X-Y-XF-YF-0], Value, Record, Record1),
				((Value =:= 10000,evaluate_and_chooseUpdated([],Board,Player,Record1,BestMove),!);
				evaluate_and_chooseUpdated(ListMoves,Board,Player,Record1,BestMove)).

evaluate_and_chooseUpdated([X-Y-XF-YF-1 | ListMoves] ,Board, Player ,Record, BestMove):-
				movePiece(Board,X,Y,XF,YF,NewBoard),
				listAllPossibleMoves(NewBoard,Player,1,List2),
				random_permutation(List2,List3),
				evaluate_and_chooseUpdated(List3,NewBoard,Player,(_,-10000),(BestMove2,BestValue)),
				append([X-Y-XF-YF-1],BestMove2,Result),
				updateBestMove(Result, BestValue, Record, Record2),
				((BestValue =:= 10000,evaluate_and_chooseUpdated([],Board,Player,Record2,BestMove),!);
				evaluate_and_chooseUpdated(ListMoves,Board,Player,Record2,BestMove)).

updateBestMove(_,Value,(Move1,Value1),(Move1,Value1)):- Value =< Value1.
updateBestMove(Move,Value,(_,Value1),(Move,Value)):- Value > Value1.

%evaluateBoard(Board,Player,Value).

evaluateBoard(Board,_,Value):- 	\+(continueGame(Board)),Value is 10000,!.
evaluateBoard(Board,0,Value):-	numberOfCheckMateGray(Board,N),Value is -1500*N,!.
evaluateBoard(Board,0,Value):-	numberOfCheckMateYellow(Board,N),\+ (checkMateGray(Board,_,_,_,_)),Value is 1500*N,!.
evaluateBoard(Board,1,Value):-	numberOfCheckMateYellow(Board,N),Value is -1500*N,!.
evaluateBoard(Board,1,Value):-	numberOfCheckMateGray(Board,N),\+ (checkMateYellow(Board,_,_,_,_)),Value is 1500*N,!.
evaluateBoard(Board,0,Value):-	motherShipPositionValue(Board,MValue),getNShips(Board,0,NPlayer),
								getNShips(Board,1,NPlayer1),Value is (MValue+NPlayer-NPlayer1),!.
evaluateBoard(Board,1,Value):-	getNShips(Board,1,NPlayer),
								getNShips(Board,0,NPlayer1),Value is (NPlayer-NPlayer1),!.

%getNShips(Board,Player,N).

getNShips(Board,0,N):-findall(X-Y,matrixGet(Board,X,Y,2),List),length(List,N).

getNShips(Board,1,N):-findall(X-Y,matrixGet(Board,X,Y,1),List),length(List,N).

%motherShipPositionValue(Value).

motherShipPositionValue(Board,Value):-whereM(Board,X,Y), Value is sqrt((abs(X-6)*abs(X-6)) + (abs(Y-6)*abs(Y-6))).

parsingListOfPlays([],[],[],[]).

parsingListOfPlays([X-Y-XF-YF-CostToSpend|List],[[X,Y]|InitList],[[XF,YF]|EndList],[CostToSpend|CostList]):-parsingListOfPlays(List,InitList,EndList,CostList).

%listAllPossibleMoves(Board,Player,CostLeft,X,Y,XF,YF,CostToSpend,List).

listAllPossibleMoves(Board,Player,CostLeft,List):-findall(X-Y-XF-YF-CostToSpend,allPossibleMoves(Board,Player,CostLeft,X,Y,XF,YF,CostToSpend),List).

%testMoves(Board,Player,CostLeft,XIndex,YIndex,XFIndex,YFIndex,CostToSpend). Tests if the Move can be done

testMoves(Board,Player,CostLeft,XIndex,YIndex,XFIndex,YFIndex,CostToSpend):-	canUseThisPiece(Board,XIndex,YIndex,Player,CostLeft,NewCost),
																				validMove(Board,XIndex,YIndex,XFIndex,YFIndex,Player,NewCost,CostToSpend),!.														

%allPossibleMoves(Board,Player,CostLeft,X,Y,XF,YF). Generate and Test random movements																			
																				
allPossibleMoves(Board,Player,CostLeft,X,Y,XF,YF,CostToSpend):-		between(1,11,XIndex),between(1,11,YIndex),between(1,11,XFIndex),between(1,11,YFIndex),
																	testMoves(Board,Player,CostLeft,XIndex,YIndex,XFIndex,YFIndex,CostToSpend),
																	X is XIndex,Y is YIndex, XF is XFIndex, YF is YFIndex.

%getRandomMove(Board,Player,CostLeft,X,Y,XF,YF,CostToSpend).

getRandomMove(Board,Player,CostLeft,X,Y,XF,YF,CostToSpend):-listAllPossibleMoves(Board,Player,CostLeft,List),random_select(X-Y-XF-YF-CostToSpend,List,_).
							
%playRandomMove(Board,Player,NewBoard,CostLeft).

playRandomMove(Board,_,Board,0).	
playRandomMove(Board,Player,NewBoard,CostLeft):-getRandomMove(Board,Player,CostLeft,X,Y,XF,YF,CostToSpend),movePiece(Board,X,Y,XF,YF,NewBoard2),
												printBotPlay(Player,X,Y,XF,YF),nl,
												printTable(NewBoard2,XF,YF),
												playRandomMove(NewBoard2,Player,NewBoard,CostToSpend).

%printBotPlay(Player, X,Y,XF,YF).

printBotPlay(0,X,Y,XF,YF):-write('Yellow Bot played X:'),write(X),write('|Y:'),write(Y),write(' to XF '), write(XF),write('|YF:'),write(YF).
printBotPlay(1,X,Y,XF,YF):-write('Gray Bot played X:'),write(X),write('|Y:'),write(Y),write(' to XF '), write(XF),write('|YF:'),write(YF).

%printBestBotPlay(Player, X,Y,XF,YF)

printBestBotPlay(0,X,Y,XF,YF):-write('Yellow Bot played X:'),write(X),write('|Y:'),write(Y),write(' to XF '), write(XF),write('|YF:'),write(YF).
printBestBotPlay(1,X,Y,XF,YF):-write('Gray Bot played X:'),write(X),write('|Y:'),write(Y),write(' to XF '), write(XF),write('|YF:'),write(YF).

%playRandomMoveWithEnd(Board,Player,NewBoard,CostLeft). A little smarter Bot that ends whenever there is the opportunity or else it plays randomly.

playRandomMoveWithEnd(Board,_,Board,0).

playRandomMoveWithEnd(Board,0,NewBoard,2):-checkMateYellow(Board,X,Y,XF,YF),movePiece(Board,X,Y,XF,YF,NewBoard2),
													printBotPlay(0,X,Y,XF,YF), write(' - Ended with CheckMate function'), nl,
													printTable(NewBoard2,XF,YF),
													playRandomMoveWithEnd(NewBoard2,_,NewBoard,0).
													
playRandomMoveWithEnd(Board,1,NewBoard,2):-checkMateGray(Board,X,Y,XF,YF),movePiece(Board,X,Y,XF,YF,NewBoard2),
													printBotPlay(1,X,Y,XF,YF), write(' - Ended with CheckMate function'),nl,
													printTable(NewBoard2,XF,YF),
													playRandomMoveWithEnd(NewBoard2,_,NewBoard,0).

playRandomMoveWithEnd(Board,Player,NewBoard,CostLeft):-playRandomMove(Board,Player,NewBoard,CostLeft).

%applyMoves(ListMoves,Board,Player,NewBoard).

applyMoves([],Board,_,Board).

applyMoves([X-Y-XF-YF-_|Rest],Board,Player,NewBoard):-	movePiece(Board,X,Y,XF,YF,NewBoard2),
														printBestBotPlay(Player,X,Y,XF,YF),nl,
														printTable(NewBoard2,XF,YF),
														applyMoves(Rest,NewBoard2,Player,NewBoard).

%playBestMove(Board,Player,NewBoard,CostLeft).	
	
playBestMove(Board,_,Board,0).
	
playBestMove(Board,Player,NewBoard,CostLeft):-	getBestMove(Board,Player,X,Y,XF,YF,CostLeft,CostToSpend),movePiece(Board,X,Y,XF,YF,NewBoard2),
												printBestBotPlay(Player,X,Y,XF,YF),nl,
												printTable(NewBoard2,XF,YF),
												playBestMove(NewBoard2,Player,NewBoard,CostToSpend).														
														
%playBestMoveUpdated(Board,Player,NewBoard).	

playBestMoveUpdated(Board,Player,NewBoard):-	getBestMoveUpdated(Board,Player,(Moves,_)),
												applyMoves(Moves,Board,Player,NewBoard),!.
											
%numberOfCheckMateYellow(Board,N).
numberOfCheckMateYellow(Board,N):-findall(X-Y-XF-YF,checkMateYellow(Board,X,Y,XF,YF),List),length(List,N),((N =:= 0,fail);(N=\=0)).

%numberOfCheckMateGray(Board,N).
numberOfCheckMateGray(Board,N):-findall(X-Y-XF-YF,checkMateGray(Board,X,Y,XF,YF),List),length(List,N),((N =:= 0,fail);(N=\=0)).
												
%checkMateYellow(Board,X,Y,XF,YF).

checkMateYellow(Board,X,Y,XF,YF):-whereM(Board,X,Y),((inLine(Board,X,Y,1,Y),XF is 1, YF is Y);(inLine(Board,X,Y,11,Y),XF is 11, YF is Y);(inLine(Board,X,Y,X,1),XF is X, YF is 1);(inLine(Board,X,Y,X,11),XF is X, YF is 11)).

%checkMateGray(Board,XF,YF,X,Y).

checkMateGray(Board,XF,YF,X,Y):-whereM(Board,X,Y),getDiagonals(X,Y,XTemp,YTemp),matrixGet(Board,XTemp,YTemp,Value),Value =:= 1,XF is XTemp,YF is YTemp.

%%%%%%%%%%%%%%%%%%%%%% Printing  %%%%%%%%%%%%%%%%%%%%%%

%printBoard(Board,X,Y).

printTable(Board,X,Y):- 	nl,
							printFirstLine(_),
							nl,
							printLines(Board,X,Y),
							nl,nl.
							
printLines(Board,X,Y):-between(1,11,YIndex),nl, write(YIndex),((YIndex < 10, write(' |'));(YIndex >= 10,write('|'))), printRestLine(Board,YIndex,X,Y).

printRestLine(Board,YIndex,X,Y):-	between(1,11,XIndex), matrixGet(Board,XIndex,YIndex,Value),
									((XIndex=:=X,YIndex=:=Y,writePiece(Value,1));( \+ (XIndex=:=X,YIndex=:=Y),writePiece(Value,0))), XIndex =:= 11,nl,printDivison(_), YIndex =:= 11.

printDivison(_):-write('-----------------------------------------------').

printFirstLine(_):-write('    1   2   3   4   5   6   7   8   9   10  11 ').

writePiece(0,0):-write(' . |').
writePiece(1,0):-write(' D |'). %%%% Defesa %%%%
writePiece(2,0):-write(' A |'). %%%% Ataque %%%%
writePiece(5,0):-write(' M |'). %%%% Objetivo %%%%
writePiece(1,1):-write('(D)|'). %%%% Defesa %%%%
writePiece(2,1):-write('(A)|'). %%%% Ataque %%%%
writePiece(5,1):-write('(M)|'). %%%% Objetivo %%%%

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%