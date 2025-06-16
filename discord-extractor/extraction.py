from bs4 import BeautifulSoup, Tag

def clean_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Find target div using class and aria attributes
    target_div = soup.find('div', {
        'class': 'focusLock__49fc1',
        'role': 'dialog',
        'aria-modal': 'true'
    })
    
    if not target_div:
        return html_content

    # Preserve all styles and scripts
    preserved = []
    for tag in soup.find_all(['style', 'script']):
        preserved.append(tag.extract())

    # Keep only the target div's lineage
    current = target_div
    while current.parent:
        parent = current.parent
        for sibling in parent.find_all(recursive=False):
            if sibling is not current:
                sibling.decompose()
        current = parent

    # Re-add preserved elements to head or body
    head = soup.head
    body = soup.body or soup.new_tag('body')
    for elem in preserved:
        if elem.name == 'style' and head:
            head.append(elem)
        else:
            body.append(elem)

    return str(soup)