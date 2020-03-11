let isOpen=false;
function toggleNavBar(){
    console.log("clicked");
    if(isOpen){
        isOpen=false;
        document.getElementById("header-options").classList.remove("open-nav");
        document.getElementById("header-options").classList.add("close-nav");
    }else{
        isOpen=true;
        document.getElementById("header-options").classList.remove("close-nav");
        document.getElementById("header-options").classList.add("open-nav");
    }
}
document.getElementById("nav-toggle").addEventListener("click",toggleNavBar);
document.getElementById("addBook").addEventListener("click",toggleNavBar);
document.getElementById("viewBooks").addEventListener("click",toggleNavBar);

let contractInstance=null;
let client=null;
let contractAddress="ct_WcavyvqNkRPbS8MWjes1DAuSfJfnVmB5eoANj1dPi1g1xiyxb";
let contractSource=`
contract BookLibraryContract=
    record bookInfo={
       name:string,
       isbn:string,
       date:string
       }
    record state={
       bookLibrarian: map(address,list(bookInfo))
      }

    stateful entrypoint init()={bookLibrarian={}}


    stateful entrypoint registerBook(name':string,isbn':string,date':string)=
      let usersListOfBooks=Map.lookup_default(Call.caller,state.bookLibrarian,[])
      let newBookInfo={name=name',isbn=isbn',date=date'}
      let newListOfBooks=newBookInfo::usersListOfBooks
      put(state{bookLibrarian[Call.caller]=newListOfBooks})


    entrypoint getUsersListOfBooks()=
        Map.lookup_default(Call.caller,state.bookLibrarian,[])
`; 

    
window.addEventListener('load',async function(){
    client=await Ae.Aepp();
    contractInstance=await client.getContractInstance(contractSource,{contractAddress});
    let allBooks=(await contractInstance.methods.getUsersListOfBooks()).decodedResult;
    console.log(allBooks,"allBooks");
    allBooks.map(book=>{
        addBookToDom(book.name,book.isbn)
    })
    document.getElementById("loader").style.display="none";
});

async function handleSubmitBook(title,isbn){
    let title=document.getElementById("input-title").Value;
    let isbn=document.getElementById("input-isbn").Value;
    let date=document.getElementById("input-date").Value;
    if(title.trim()!=""&&isbn.trim()!=""&&date.trim()!=""){
        document.getElementById("loader").style.display="block";
        await contractInstance.methods.registerBook(title,isbn,date);
        addBookToDom(title,isbn);
        document.getElementById("loader").style.display="none";

    }
}

document.getElementById("submit-book").addEventListener("click",handleSubmitBook);

function addBookToDom(title,isbn){
   let allBooks=document.getElementById("list-books-section");

   let newBookDiv=document.createElement("div");
   newBookDiv.classList.add("book");

   let bookTitleParagraph=document.createElement("p");
   bookTitleParagraph.innerText=title;

   let bookISBNParagraph=document.createElement("p");
   bookISBNParagraph.innerText=isbn;

   newBookDiv.appendChild(bookTitleParagraph);
   newBookDiv.appendChild(bookISBNParagraph);

   allBooks.appendChild(newBookDiv);
}

addBookToDom("ayeni tea","12345");