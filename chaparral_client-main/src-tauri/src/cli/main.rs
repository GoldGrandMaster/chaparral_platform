use std::fs::File;
use std::io::{self, Read, Write};

fn read_file(file_path: &str) -> io::Result<String> {
    let mut file = File::open(file_path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

fn write_file(file_path: &str, content: &str) -> io::Result<()> {
    let mut file = File::create(file_path)?;
    file.write_all(content.as_bytes())?;
    Ok(())
}

fn main() {
    let input_file_path = "./src/cli/file.txt";
    let output_file_path = "./src/cli/output.txt";

    match read_file(input_file_path) {
        Ok(contents) => {
            println!("Read contents:\n{}", contents);
            match write_file(output_file_path, &contents) {
                Ok(()) => println!("Successfully wrote output file."),
                Err(err) => eprintln!("Error writing output file: {}", err),
            }
        }
        Err(err) => eprintln!("Error reading input file: {}", err),
    }
}
