import re

SENSITIVE_COOKIES = ['sessionid', 'csrftoken']
SENSITIVE_HEADERS = ['Cookie']


def before_send(event, hint):
    request = event.get('request')
    if request:
        cookies = request.get('cookies')
        for cookie_name in SENSITIVE_COOKIES:
            if cookie_name in cookies:
                cookie_value = cookies.get(cookie_name)
                event['request']['cookies'][cookie_name] = re.sub('[^\s]', '*', cookie_value)

        headers = request.get('headers')
        for header_name in SENSITIVE_HEADERS:
            if header_name in headers:
                header_value = headers.get(header_name)
                event['request']['headers'][header_name] = re.sub('[^\s]', '*', header_value)

    try:
        exceptions = event.get('exception', {}).get('values', [])
        if exceptions:
            frames = exceptions[0].get('stacktrace', {}).get('frames', [])
            if frames:
                frame = frames[-1]
                exception_module = frame.get('module')
                if exception_module:
                    app_module = exception_module.split('.')[0]
                    if 'tags' not in event:
                        event['tags'] = {}
                    event['tags']['app'] = app_module
                    event['tags']['module'] = exception_module
    except Exception as exc:
        pass

    if 'exc_info' in hint:
        exc_type, exc_value, tb = hint['exc_info']
        if isinstance(exc_value, SystemExit):
            event['fingerprint'] = ['system-exit', event.get('transaction')]

    return event
