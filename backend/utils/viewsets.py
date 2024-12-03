class SerializerByActionMixin(object):
    """
    Allows define 'serializer_class' for specific action using serializer_by_action attribute.

    'serializer_by_action' is dict with key of action name and value of serializer to use for action
    'serializer_by_action' must contain "default" key whose value is serializer, which
    will be used when there is no serializer defined for specific action.

    Example use cases:
    You need to return different data for different actions (eg. list/retrieve)
    You need to use different serializers for 'create'/'update'

    Example 'serializer_by_action':
    serializer_by_action = {
        "default": Serializer,
        "list": ListSerializer,
        "retrieve": retrieveSerializer,
        "create": CreateSerializer,
        "update": CreateSerializer,
    }
    """

    @property
    def serializer_by_action(self):
        raise NotImplementedError("You must specify serializer_by_action attribute")

    def __init__(self, *args, **kwargs):
        default_serializer = self.serializer_by_action.get('default')
        assert default_serializer is not None, '''You must specify "default"
        serializer in serializer_by_action class attribute'''

    def get_serializer_class(self):
        serializer = self.serializer_by_action.get(self.action)
        if self.action == 'partial_update' and serializer is None:
            serializer = self.serializer_by_action.get('update')
        if serializer is None:
            return self.serializer_by_action.get('default')
        return serializer
