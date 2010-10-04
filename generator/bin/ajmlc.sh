#!/bin/sh
echo  $1 $2 $3 $4 $5


java -cp "classes;lib/commons-io-1.4.jar;lib/tools.jar;lib/jetty-all-7.0.2.v20100331.jar;lib/servlet-api-2.5.jar;lib/derby.jar;" ajweb.generator.Main $1 $2 $3 $4 $5
