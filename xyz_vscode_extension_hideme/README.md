# XYZ .hideme

An extension that allows you to easily hide files and folders that are listed in your project's .hideme file.

# How to use

1. Create a file ending or starting with `.hideme` in any folder in your project.
2. List the files and folders you want to hide to the `.hideme` file.
3. You can use asterisks `*` to hide all files and folders that match a pattern.
4. Open any `.hideme` file and hit `Cmd+H` on MacOS or `Ctrl+H` on Windows to toggle the visibility of the files and folders listed in the avtive `.hideme` file.

# Example of a .hideme file

```txt
lib/main.dart
*.g.dart
*.md
```