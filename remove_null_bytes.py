# Open the file in binary mode and remove null bytes
with open('models.py', 'rb') as file:
    content = file.read()

# Remove null bytes (replace b'\x00' with empty byte string)
content = content.replace(b'\x00', b'')

# Write the cleaned content back to the file
with open('models.py', 'wb') as file:
    file.write(content)

print("Null bytes removed successfully!")
