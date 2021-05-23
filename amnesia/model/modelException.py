class ModelException(Exception):
    def __init__(self, component: str = '', message: str = 'Fatal Error Has Occured') -> None:
        self.component = component
        self.message = message
        super()

    def __str__(self):
        return f'Component: {self.component}\nError: {self.message}'
