#!/bin/bash

problemEnd=0
problemStart=0
isProblemNow=0
generateProblemTime=0
problemSegment=0
problemBT=0
seconds=$(date +"%s")
seconds=${seconds#0}
problemStart=$((seconds + 30))
problemEnd=$((problemStart + 600))

while true
do

    seconds=$(date +"%s")
    seconds=${seconds#0}

#echo ""
#echo "seconds: $seconds, problemStart: $problemStart, problemEnd: $problemEnd, isProblemNow: $isProblemNow, generateProblemTime: $generateProblemTime, problemBT: $problemBT, problemSegment: $problemSegment"
#echo ""

    if [[ $generateProblemTime -eq 1 ]];then

        generateProblemTime=0
        timeUntilProblem=$(( RANDOM % 1800 ))
        problemStart=$((seconds + timeUntilProblem))
        problemEnd=$((problemStart + 600))

    fi

    if [[ $isProblemNow -eq 1 ]]; then

        if [[ $seconds -ge $problemEnd ]]; then
            isProblemNow=0
            generateProblemTime=1
            problemSegment=0
            problemBT=0
        fi

    elif [[ $seconds -ge $problemStart && $seconds -lt $problemEnd ]]; then

        isProblemNow=1
        problemBT=$((RANDOM%6+1))

    fi

    if [[ $problemBT -eq 1 ]]; then

        if [[ $problemSegment -eq 0 ]]; then
            problemSegment=1
        fi

        nohup curl -H"problemSegment: $problemSegment" http://web-front-end:8080/WebFrontEnd/login
    else
        nohup curl http://web-front-end:8080/WebFrontEnd/login
    fi
    sleep .$(( RANDOM % 1000 ))

    if [[ $problemBT -eq 2 ]]; then

        if [[ $problemSegment -eq 0 ]]; then
            problemSegment=$((RANDOM%r2+1))
        fi

        nohup curl -H"problemSegment: $problemSegment" http://web-front-end:8080/WebFrontEnd/purchaseGamePass
    else
        nohup curl http://web-front-end:8080/WebFrontEnd/purchaseGamePass
    fi
    sleep .$(( RANDOM % 1000 ))

    if [[ $problemBT -eq 3 ]]; then

        if [[ $problemSegment -eq 0 ]]; then
            problemSegment=$((RANDOM%2+1))
        fi

        nohup curl -H"problemSegment: $problemSegment" http://web-front-end:8080/WebFrontEnd/joinGame
    else
        nohup curl http://web-front-end:8080/WebFrontEnd/joinGame
    fi
    sleep .$(( RANDOM % 1000 ))

    if [[ $problemBT -eq 4 ]]; then

        if [[ $problemSegment -eq 0 ]]; then
            problemSegment=$((RANDOM%4+1))
        fi

        nohup curl -H"problemSegment: $problemSegment" http://client-api:8080/ClientAPI/updateAction
    else
        nohup curl http://client-api:8080/ClientAPI/updateAction
    fi
    sleep .$(( RANDOM % 1000 ))

    if [[ $problemBT -eq 5 ]]; then

        if [[ $problemSegment -eq 0 ]]; then
            problemSegment=$((RANDOM%3+1))
        fi

        nohup curl -H"problemSegment: $problemSegment" http://client-api:8080/ClientAPI/chat
    else
        nohup curl http://client-api:8080/ClientAPI/chat
    fi
    sleep .$(( RANDOM % 1000 ))

    if [[ $problemBT -eq 6 ]]; then

        if [[ $problemSegment -eq 0 ]]; then
            problemSegment=$((RANDOM%4+1))
        fi

        nohup curl -H"problemSegment: $problemSegment" http://client-api:8080/ClientAPI/getWorld
    else
        nohup curl http://client-api:8080/ClientAPI/getWorld
    fi
    sleep .$(( RANDOM % 1000 ))v

done