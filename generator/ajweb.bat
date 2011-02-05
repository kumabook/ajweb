@ECHO OFF
ECHO %~dp0
cd %~dp0
ECHO .\
IF EXIST %2 GOTO COMANDLINE
ECHO ドロップされたファイルを実行。
java -cp "dist/ajweb.jar;lib/compiler/commons-io-1.4.jar;lib/compiler/tools.jar;lib/servlet/jetty-all-7.0.2.v20100331.jar;lib/servlet/servlet-api-2.5.jar;lib/servlet/derby.jar;" ajweb.server.Main -war %1 
GOTO EXIT

:COMANDLINE
ECHO コマンドラインで実行
java -cp "dist/ajweb.jar;lib/compiler/commons-io-1.4.jar;lib/compiler/tools.jar;lib/servlet/jetty-all-7.0.2.v20100331.jar;lib/servlet/servlet-api-2.5.jar;lib/servlet/derby.jar;" ajweb.server.Main %1 %2 %3 %4 %5
GOTO EXIT


:EXIT

PAUSE



