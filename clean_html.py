from bs4 import BeautifulSoup
import re
import os

def clean_html(input_file_path, output_file_path):
    print(f"Reading file from: {input_file_path}")
    # Read the input HTML file
    try:
        with open(input_file_path, 'r', encoding='utf-8') as file:
            html_content = file.read()
            print(f"Successfully read {len(html_content)} characters")
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    # Parse HTML with BeautifulSoup
    print("Parsing HTML with BeautifulSoup...")
    soup = BeautifulSoup(html_content, 'html.parser')

    # Find the target div
    print("Searching for target div...")
    target_div = soup.find('div', class_='focusLock__49fc1')
    
    if not target_div:
        print("Target div not found! Here are all div classes in the document:")
        for div in soup.find_all('div', class_=True):
            print(f"Found div with classes: {div.get('class')}")
        return
    else:
        print(f"Found target div with content length: {len(str(target_div))}")

    # Create a new soup with just the basic structure
    new_soup = BeautifulSoup('<!DOCTYPE html><html><head></head><body></body></html>', 'html.parser')

    # Copy all style and script tags from head
    print("Copying style and script tags...")
    original_head = soup.find('head')
    if original_head:
        for tag in original_head.find_all(['style', 'script', 'link']):
            try:
                new_tag = tag.copy()
                new_soup.head.append(new_tag)
                print(f"Copied {tag.name} tag")
            except Exception as e:
                print(f"Warning: Could not copy head tag: {e}")

    try:
        # Create a container div for our target
        container = new_soup.new_tag('div')
        new_soup.body.append(container)
        
        # Copy the target div and its contents
        print("Copying target div...")
        target_copy = BeautifulSoup(str(target_div), 'html.parser').div
        if target_copy is None:
            print("Error: Failed to copy target div")
            return
            
        print(f"Target div copy length: {len(str(target_copy))}")
        container.append(target_copy)

        # Save the cleaned HTML
        print("Saving file...")
        final_html = str(new_soup)
        print(f"Final HTML length: {len(final_html)}")
        
        with open(output_file_path, 'w', encoding='utf-8') as file:
            file.write(final_html)
            
        print(f"File saved successfully with {len(final_html)} characters")
        
        # Verify file was written
        if os.path.exists(output_file_path):
            file_size = os.path.getsize(output_file_path)
            print(f"Verified: Output file exists with size: {file_size} bytes")
        else:
            print("Warning: Output file does not exist after writing!")
            
    except Exception as e:
        print(f"Error saving file: {e}")
        import traceback
        traceback.print_exc()
        return

if __name__ == "__main__":
    try:
        # Input and output file paths
        input_file = "C:\\Users\\ASUS\\Downloads\\mess.html"
        output_file = "C:\\Users\\ASUS\\Downloads\\cleaned_output.html"
        
        print(f"Starting HTML cleaning process...")
        print(f"Input file: {input_file}")
        print(f"Output file: {output_file}")
        
        # Clean the HTML
        clean_html(input_file, output_file)
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc() 