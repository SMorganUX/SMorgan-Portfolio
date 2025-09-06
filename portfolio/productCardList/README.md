# Product Card List

**Product Card List** is a product card generation and sorting tool.

## Purpose
The code 

## Other Internal Name(s)
- debtCalc

## Features
- Extracts product information from spreadsheet to autogenerate product cards
- Removes need for manually updating or inputting each products information into the website
- Creates a side menu of all categories listed in the spreadsheet that links to the location of each category in the product list

# Technologies
- HTML
- CSS
- Javascript
- JSON
- Google Sheets (for test product spreadsheet)

## Use Instructions

The code is usable to be copied into existing projects as is

### HTML, CSS, JS
These files can be copied and added to existing project codes, with minor changes needed to properly integrate it based on project needs and adjust page stylings.

### Product Spreadsheet
This demo utilizes a **Google Sheets** spreadsheet for testing and showcasing purposes due to the ease of updating the spreadsheets contents without needing to reupload the file. Other spreadsheet formats are also usable, such as **Excel**.
Spreadsheet format:
| Image file name |Product Name  | Product Description| Categories |
|--|--|--|--|
| mellow1 | Tropical Smoothie | "Description in quotes" | VeganlProbiotic |
|mellow2| Berry Mixer | "Description in quotes" | Fruit|
- Image files are **png**, but can be **jpeg** by updating the JavaScript for the card formatting. Do not include the file extension in the spreadsheet. For mixed file types (both png and jpegs being used), removal of the file type from the image source link can be done and the file type extension used in the spreadsheet.
- Product Names can be added without formatting
- Product Descriptions are contained within double quotes
- Multiple Categories are separated with a |


## Project Status
Final.

# Contributor
Samantha R. Morgan
Computer Science Major, Minor in Studio Art
University of North Georgia (est. 2026)
