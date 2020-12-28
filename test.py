

class person():
    name=[1,3]
    def myvar(self):
        self.name=[1,2]
    def __init__(self):
        self.lb="ldsd"

a=person()
a.myvar()
print(a.name)

b=person()
print(b.name)

