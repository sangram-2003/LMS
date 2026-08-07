import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBooks, deleteBook } from "../../features/book/bookSlice";
import { getCategories } from "../../features/book/categorySlice";
import Search from "../../components/ui/search";
import FilterDropdown from "../../components/ui/FilterDropdown";
import BookCard01 from "../../components/ui/BookCard01";
import Button from "../../components/ui/Button";
import { FaPlus } from "react-icons/fa6";

function Books() {
  const dispatch = useDispatch();

  // Redux state
  const { books, loading, error } = useSelector((state) => state.book);
  const {categories} =useSelector((state)=>state.category);
  //Local state
  const [searchItem, setSearchItem] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  console.log(activeCategory , "active categories")
  // Fetch books
 useEffect(() => {
  dispatch(getBooks());
  dispatch(getCategories());
}, [dispatch]);

const handleOnDelete =(isbn)=>{
  dispatch(deleteBook(isbn));
}


const categoryOptions = [
  "All",
  ...(categories || []).map((cat) => cat.category_id)
];
console.log(categoryOptions , "category option", categories)

const filteredBooks = (books || []).filter((book) => {
  const search = (searchItem || "").toLowerCase();

  const title = book.title?.toLowerCase() || "";
  const author = book.author?.toLowerCase() || "";
  const category = String(book.category_id || "").toLowerCase();

  const matchesSearch =
    title.includes(search) || author.includes(search);

  const activeCat = String(activeCategory || "").toLowerCase();

  const matchesCategory =
    activeCategory === "All" || category === activeCat;

  return matchesSearch && matchesCategory;
});

console.log(typeof(filteredBooks), "ff" , typeof(books));
  return (
    
    <div className="flex min-h-screen bg-gray-50 text-slate-700">
      <main className="flex-1 p-6 md:p-10">

        {/* Header */}
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
            Manage Books
          </h2>

          {/* Total count */}
          <p className="text-sm text-gray-500 mb-6">
            Total: {filteredBooks.length} books
          </p>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

            {/* Search */}
            <Search
              placeholder="Search books..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
            />

            {/*Filter + Add */}
            <div className="flex gap-4 items-center">
           
                  
                 <FilterDropdown
  options={categoryOptions}
  selected={activeCategory}
  onSelect={setActiveCategory}
  data ={categories}
/>
             
              <Button
                title="Add"
                icon={<FaPlus />}
                link="/dashboard/add-book"
              />
            </div>
          </div>
        </header>

        
        {loading && (
          <p className="text-blue-500 text-center">Loading books...</p>
        )}

        
        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {/*Books */}
        {!loading && filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <BookCard01
                key={book.id}
                title={book.title}
                category={
  categories.find((cate) => cate.category_id === book.category_id)?.category_name || "Unknown"
}
                author={book.author}
                ISBN={book.isbn}
                stock={book.available}
                handleOnDelete={()=>handleOnDelete(book.isbn)}
                color={book.color || "bg-gray-500"}

                
              />
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-center text-gray-400 mt-10">
              No books found 😢
            </p>
          )
        )}

      </main>
    </div>
  );
}

export default Books;