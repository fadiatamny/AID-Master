class ModelException(Exception):
    def __init__(self, component: str = '', message: str = 'Fatal Error Has Occured') -> None:
        self.component = component
        self.message = message
        super().__init__(str)
