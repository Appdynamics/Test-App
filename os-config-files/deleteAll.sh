oc delete -f action-response-services.yaml
oc delete -f ai-services.yaml
oc delete -f chat-services.yaml
oc delete -f client-api.yaml
oc delete -f app-load.yaml
oc delete -f player-action-services.yaml
oc delete -f web-api.yaml
oc delete -f web-front-end.yaml
oc delete -f world-change-services.yaml

oc delete -f machine-agent.yaml
