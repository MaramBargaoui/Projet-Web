with open('models.py', 'rb') as file:
    content = file.read()

content = content.replace(b'\x00', b'')

with open('models.py', 'wb') as file:
    file.write(content)

print("Null bytes removed successfully!")
