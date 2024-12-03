from functools import wraps


def login_exempt(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        return view(*args, **kwargs)
    wrapped_view.login_exempt = True
    return wrapped_view
