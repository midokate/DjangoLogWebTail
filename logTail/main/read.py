
import  os

new_path="d:\\file.txt"

with open(new_path,'r') as file:
    file.seek(236162)
    i=0
    for line in file.readlines():
        print(line.)
        i+=1
    print(i)