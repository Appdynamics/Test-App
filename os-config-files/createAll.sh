oc create -f action-response-services.yaml
oc create -f ai-services.yaml
oc create -f chat-services.yaml
oc create -f client-api.yaml
oc create -f app-load.yaml
oc create -f player-action-services.yaml
oc create -f web-api.yaml
oc create -f web-front-end.yaml
oc create -f world-change-services.yaml

oc create -f machine-agent.yaml
