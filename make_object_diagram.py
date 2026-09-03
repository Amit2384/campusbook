import urllib.request
import urllib.parse
import json

dot_code = """
graph ObjectDiagram {
    bgcolor="white";
    rankdir=TB;
    node [shape=plain, fontname="Arial"];
    edge [fontname="Arial", fontsize=10];

    // Roles and Users
    role_buyer [label=<
        <table border="1" cellborder="0" cellspacing="0">
            <tr><td bgcolor="lightblue"><b><u>role1 : ROLES</u></b></td></tr>
            <tr><td align="left">id = 1</td></tr>
            <tr><td align="left">name = "Buyer"</td></tr>
        </table>
    >];

    role_seller [label=<
        <table border="1" cellborder="0" cellspacing="0">
            <tr><td bgcolor="lightblue"><b><u>role2 : ROLES</u></b></td></tr>
            <tr><td align="left">id = 2</td></tr>
            <tr><td align="left">name = "Seller"</td></tr>
        </table>
    >];

    user_buyer [label=<
        <table border="1" cellborder="0" cellspacing="0">
            <tr><td bgcolor="lightyellow"><b><u>buyer1 : USERS</u></b></td></tr>
            <tr><td align="left">id = 101</td></tr>
            <tr><td align="left">role_id = 1</td></tr>
            <tr><td align="left">name = "Alice"</td></tr>
        </table>
    >];

    user_seller [label=<
        <table border="1" cellborder="0" cellspacing="0">
            <tr><td bgcolor="lightyellow"><b><u>seller1 : USERS</u></b></td></tr>
            <tr><td align="left">id = 102</td></tr>
            <tr><td align="left">role_id = 2</td></tr>
            <tr><td align="left">name = "Bob"</td></tr>
        </table>
    >];

    // Category and Books
    category1 [label=<
        <table border="1" cellborder="0" cellspacing="0">
            <tr><td bgcolor="honeydew"><b><u>cat1 : CATEGORIES</u></b></td></tr>
            <tr><td align="left">id = 10</td></tr>
            <tr><td align="left">name = "Computer Science"</td></tr>
        </table>
    >];

    book1 [label=<
        <table border="1" cellborder="0" cellspacing="0">
            <tr><td bgcolor="lightpink"><b><u>book1 : BOOKS (Purchase)</u></b></td></tr>
            <tr><td align="left">id = 501</td></tr>
            <tr><td align="left">seller_id = 102</td></tr>
            <tr><td align="left">title = "Algorithms 101"</td></tr>
            <tr><td align="left">price = 45.00</td></tr>
        </table>
    >];

    book_rent [label=<
        <table border="1" cellborder="0" cellspacing="0">
            <tr><td bgcolor="lightpink"><b><u>book2 : BOOKS (Rental)</u></b></td></tr>
            <tr><td align="left">id = 502</td></tr>
            <tr><td align="left">seller_id = 102</td></tr>
            <tr><td align="left">title = "Data Structures"</td></tr>
            <tr><td align="left">rental_price = 15.00</td></tr>
        </table>
    >];

    // Orders and Order Items
    order1 [label=<
        <table border="1" cellborder="0" cellspacing="0">
            <tr><td bgcolor="lightcyan"><b><u>order1 : ORDERS</u></b></td></tr>
            <tr><td align="left">id = 1001</td></tr>
            <tr><td align="left">buyer_id = 101</td></tr>
            <tr><td align="left">total_amount = 60.00</td></tr>
        </table>
    >];

    order_item_buy [label=<
        <table border="1" cellborder="0" cellspacing="0">
            <tr><td bgcolor="peachpuff"><b><u>item_buy : ORDER_ITEMS</u></b></td></tr>
            <tr><td align="left">id = 2001</td></tr>
            <tr><td align="left">order_id = 1001</td></tr>
            <tr><td align="left">book_id = 501</td></tr>
            <tr><td align="left">type = "purchase"</td></tr>
        </table>
    >];

    order_item_rent [label=<
        <table border="1" cellborder="0" cellspacing="0">
            <tr><td bgcolor="peachpuff"><b><u>item_rent : ORDER_ITEMS</u></b></td></tr>
            <tr><td align="left">id = 2002</td></tr>
            <tr><td align="left">order_id = 1001</td></tr>
            <tr><td align="left">book_id = 502</td></tr>
            <tr><td align="left">type = "rental"</td></tr>
        </table>
    >];

    // Payment, Reviews (Feedback), Rentals, Wishlist
    payment1 [label=<
        <table border="1" cellborder="0" cellspacing="0">
            <tr><td bgcolor="thistle"><b><u>pay1 : PAYMENTS</u></b></td></tr>
            <tr><td align="left">id = 3001</td></tr>
            <tr><td align="left">order_id = 1001</td></tr>
            <tr><td align="left">amount = 60.00</td></tr>
        </table>
    >];

    review1 [label=<
        <table border="1" cellborder="0" cellspacing="0">
            <tr><td bgcolor="lavender"><b><u>rev1 : REVIEWS (Feedback)</u></b></td></tr>
            <tr><td align="left">id = 4001</td></tr>
            <tr><td align="left">buyer_id = 101</td></tr>
            <tr><td align="left">rating = 5</td></tr>
            <tr><td align="left">comment = "Very fast delivery!"</td></tr>
        </table>
    >];

    rental1 [label=<
        <table border="1" cellborder="0" cellspacing="0">
            <tr><td bgcolor="lightcoral"><b><u>rent1 : RENTALS</u></b></td></tr>
            <tr><td align="left">id = 5001</td></tr>
            <tr><td align="left">order_item_id = 2002</td></tr>
            <tr><td align="left">book_id = 502</td></tr>
            <tr><td align="left">status = "active"</td></tr>
        </table>
    >];

    wishlist1 [label=<
        <table border="1" cellborder="0" cellspacing="0">
            <tr><td bgcolor="gold"><b><u>wish1 : WISHLIST</u></b></td></tr>
            <tr><td align="left">id = 6001</td></tr>
            <tr><td align="left">user_id = 101</td></tr>
            <tr><td align="left">book_id = 502</td></tr>
        </table>
    >];

    // Links (Relationships between instances)
    role_buyer -- user_buyer [label=" has role"];
    role_seller -- user_seller [label=" has role"];
    
    user_seller -- book1 [label=" sells"];
    user_seller -- book_rent [label=" sells"];
    category1 -- book1 [label=" categorizes"];
    category1 -- book_rent [label=" categorizes"];
    
    // Order Flow
    user_buyer -- order1 [label=" places"];
    order1 -- order_item_buy [label=" contains"];
    order1 -- order_item_rent [label=" contains"];
    book1 -- order_item_buy [label=" included in"];
    book_rent -- order_item_rent [label=" included in"];
    
    order1 -- payment1 [label=" paid via"];
    
    // Feedback / Review Flow
    user_buyer -- review1 [label=" writes"];
    user_seller -- review1 [label=" receives"];

    // Rental Flow
    order_item_rent -- rental1 [label=" results in"];
    user_buyer -- rental1 [label=" rents"];
    book_rent -- rental1 [label=" rented as"];

    // Wishlist Flow
    user_buyer -- wishlist1 [label=" adds to"];
    book_rent -- wishlist1 [label=" added to"];
}
"""

data = json.dumps({"graph": dot_code, "layout": "dot", "format": "png"}).encode('utf-8')

req = urllib.request.Request('https://quickchart.io/graphviz', data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as response:
        with open('object_diagram.png', 'wb') as f:
            f.write(response.read())
    print("Graph generated successfully as object_diagram.png")
except Exception as e:
    print(f"Error: {e}")
