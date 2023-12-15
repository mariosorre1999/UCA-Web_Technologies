
function loadState() {
    var storedMovies = localStorage.getItem('movies');

    if (storedMovies) {
        var movies = JSON.parse(storedMovies);
        movies.forEach(function(movie) {
            addMovieRow(movie);
        });
    }
}

function saveState() {
    var todosTable = document.getElementById("todos");
    var rows = todosTable.rows;
    var movies = [];

    for (var i = 0; i < rows.length; i++) {
        var movieData = rows[i].dataset.movie;
        if (movieData) {
            movies.push(JSON.parse(movieData));
        }
    }

    localStorage.setItem('movies', JSON.stringify(movies));
}

function sortTableByColumn(tableId, columnIndex, ascending = true) {
    var table = document.getElementById(tableId);
    var rows = Array.from(table.rows).slice(1); // Exclude the header row

    rows.sort(function (rowA, rowB) {
        var cellA = rowA.cells[columnIndex].textContent.trim().toLowerCase();
        var cellB = rowB.cells[columnIndex].textContent.trim().toLowerCase();

        if (!isNaN(parseFloat(cellA)) && !isNaN(parseFloat(cellB))) {
            cellA = parseFloat(cellA);
            cellB = parseFloat(cellB);
        }

        if (ascending) {
            return cellA > cellB ? 1 : -1;
        } else {
            return cellA < cellB ? 1 : -1;
        }
    });

    rows.forEach(function (row) {
        table.appendChild(row);
    });
}

document.querySelectorAll("#table thead th").forEach(function (headerCell, columnIndex) {
    headerCell.addEventListener('click', function () {
        var currentIsAscending = headerCell.classList.contains("ascending");

        if (currentIsAscending) {
            headerCell.classList.remove("ascending");
            headerCell.classList.add("descending");
            sortTableByColumn("todos", columnIndex, false);
        } else {
            headerCell.classList.remove("descending");
            headerCell.classList.add("ascending");
            sortTableByColumn("todos", columnIndex, true);
        }
    });
});


function removeAll() {
    var todosTable = document.getElementById("todos");
    todosTable.innerHTML = '';

    localStorage.removeItem('movies');

    document.getElementById("removeAll").style.display = "none";
    saveState();
}


function todoCompletion(isDone, index) {
    var todosTable = document.getElementById("todos");
    var row = todosTable.rows[index];

    if (row) {
        var checkBox = row.querySelector('input[type="checkbox"]');
        if (checkBox) {
            checkBox.checked = isDone;
        }

        var movie = JSON.parse(row.dataset.movie);
        movie.done = isDone;
        row.dataset.movie = JSON.stringify(movie);
    }
    saveState();
}

function searchMovies(searchTerm) {
    var todosTable = document.getElementById("todos");
    var rows = todosTable.rows;
    var lowerCaseSearchTerm = searchTerm.toLowerCase();

    for (var i = 0; i < rows.length; i++) {
        var movie = JSON.parse(rows[i].dataset.movie);
        var title = movie.title.toLowerCase();

        if (title.includes(lowerCaseSearchTerm)) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

document.getElementById('search').addEventListener('input', function(e) {
    searchMovies(e.target.value);
});


function removeTodo(index) {
    var todosTable = document.getElementById("todos");
    var rowToRemove = todosTable.rows[index];
    if (rowToRemove) {
        todosTable.deleteRow(index);
    }

    updateDataKeys(todosTable);
    saveState();
}

function updateDataKeys(table) {
    var rows = table.rows;
    for (var i = 0; i < rows.length; i++) {
        rows[i].setAttribute('data-key', i);
    }
}

function addMovieRow(movie) {
    var tr = document.createElement('tr');
    tr.dataset.movie = JSON.stringify(movie); // Store movie data in data attribute

    // Function to add a table cell
    function addCell(text) {
        var td = document.createElement('td');
        td.textContent = text;
        tr.appendChild(td);
    }

    // Add cells for each movie attribute
    addCell(movie.title);
    addCell(movie.platform);
    addCell(movie.actors); // Assuming actors is a string
    addCell(movie.director);
    addCell(movie.year);

    // Add the poster image
    var imgTd = document.createElement('td');
    var img = document.createElement('img');
    img.setAttribute('src', movie.posterImg);
    img.style.maxWidth = '100px';
    imgTd.appendChild(img);
    tr.appendChild(imgTd);

    // Checkbox and delete button
    var checkBoxTd = document.createElement('td');
    var checkBoxDivTd = document.createElement('div');
    var checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');
    checkBox.checked = movie.done;
    checkBoxDivTd.classList.add("flex")
    checkBoxDivTd.classList.add("flex-row")
    checkBoxDivTd.classList.add("justify-center")
    checkBoxDivTd.classList.add("items-center")
    checkBoxDivTd.classList.add("gap-2")
    checkBoxDivTd.append(checkBox);
    checkBoxTd.appendChild(checkBoxDivTd);

    var trashIcon = document.createElement('i');
    trashIcon.classList.add("fa-solid");
    trashIcon.classList.add("fa-trash");
    trashIcon.classList.add("fa-sm");
    trashIcon.style.color = "#0f172a"
    trashIcon.style.cursor = "pointer";
    checkBoxDivTd.appendChild(trashIcon);

    tr.appendChild(checkBoxTd);

    trashIcon.addEventListener('click', function() {
        var rowIndex = tr.sectionRowIndex;
        removeTodo(rowIndex);
    });

    checkBox.addEventListener('change', function() {
        var rowIndex = tr.sectionRowIndex;
        todoCompletion(checkBox.checked, rowIndex);
    });

    var todosTable = document.getElementById("todos");
    todosTable.appendChild(tr);

    saveState();
}

document.addEventListener('DOMContentLoaded', function() {
    loadState();
    if (localStorage.getItem("movies") == null
        || JSON.parse(localStorage.getItem("movies")).length === 0) {
        // debug
        console.log("localStore.getItem('movies')", localStorage.getItem("movies"));
        addMovieRow({
            title: "Mission impossible - Fallout",
            platform: "Netflix",
            actors: "Tom Cruise, Henry Cavill, Rebecca Ferguson, Simon Pegg",
            director: "Christopher McQuarrie",
            year: "2018",
            posterImg: "https://fr.web.img5.acsta.net/pictures/18/05/14/16/32/0850449.jpg",
            done: false
        });
        addMovieRow({
            title: "Creed II",
            platform: "Netflix",
            actors: "Michael B. Jordan, Sylvester Stallone, Florian Munteanu, Tessa Thompson",
            director: "Steven Caple Jr",
            year: "2018",
            posterImg: "https://m.media-amazon.com/images/M/MV5BNmZkYjQzY2QtNjdkNC00YjkzLTk5NjUtY2MyNDNiYTBhN2M2XkEyXkFqcGdeQXVyMjMwNDgzNjc@._V1_.jpg",
            done: false
        });
    }

});

function addTodo(event) {
    event.preventDefault();

    var movie = {
        title: document.getElementById("title").value,
        platform: document.getElementById("platform").value,
        actors: document.getElementById("actors").value,
        director: document.getElementById("director").value,
        year: document.getElementById("year").value,
        posterImg: document.getElementById("poster-img").value,
        done: false // Initialize as not done
    };

    addMovieRow(movie);

    document.getElementById("title").value = "";
    document.getElementById("platform").value = "";
    document.getElementById("actors").value = "";
    document.getElementById("director").value = "";
    document.getElementById("year").value = "";
    document.getElementById("poster-img").value = "";
}

