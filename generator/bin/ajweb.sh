#!/bin/sh
#echo  $1 $2 $3 $4 $5

OS=`uname`
echo $OS
if [ $OS = "Darwin" ]
then java -cp "classes:lib/compiler/commons-io-1.4.jar:lib/compiler/tools.jar:lib/servlet/jetty-all-7.0.2.v20100331.jar:lib/servlet/servlet-api-2.5.jar:lib/servlet/derby.jar:lib/servlet/sqlite-jdbc-3.7.2.jar:lib/servlet/commons-fileupdload-1.2.2.jar" ajweb.server.Main $1 $2 $3 $4 $5


else if [ $OS = "Linux" ]
then java -cp "classes:lib/compiler/commons-io-1.4.jar:lib/compiler/tools.jar:lib/servlet/jetty-all-7.0.2.v20100331.jar:lib/servlet/servlet-api-2.5.jar:lib/servlet/derby.jar:lib/servlet/sqlite-jdbc-3.7.2.jar:lib/servlet/commons-fileupdload-1.2.2.jar" ajweb.server.Main $1 $2 $3 $4 $5

else java -cp "classes;lib/compiler/commons-io-1.4.jar;lib/compiler/tools.jar;lib/servlet/jetty-all-7.0.2.v20100331.jar;lib/servlet/servlet-api-2.5.jar;lib/servlet/derby.jar;lib/servlet/sqlite-jdbc-3.7.2.jar;lib/servlet/commons-fileupdload-1.2.2.jar" ajweb.server.Main $1 $2 $3 $4 $5
fi
fi
