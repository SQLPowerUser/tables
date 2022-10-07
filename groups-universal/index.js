'use strict';

function gid(i) {return document.getElementById(i);}
function QS(el,s) {return el.querySelector(s);}

function initGroup() {
	var myTable = gid('myTable'), cmdMakeGroup = gid('cmdMakeGroup'), cmdCollapseAll = gid('cmdCollapseAll'), cmdExpandAll = gid('cmdExpandAll');
	cmdMakeGroup.disabled = false;
	cmdCollapseAll.disabled = true;
	cmdExpandAll.disabled = true;

	cmdMakeGroup.addEventListener('click', function() {makeGroupTable(myTable);});
	cmdCollapseAll.addEventListener('click', function() {swapAll(myTable, false);});
	cmdExpandAll.addEventListener('click', function() {swapAll(myTable, true);});

	function makeGroupTable(tbl) {
	var clg = gid('cbo1').value * 1; // Количесиво уровней в группировке (сокр. от CountLevelGroup)
		if (clg == 0) {return;}
		tbl.className = 'treetable';
		/********** В HTML разметке самой таблицы обязательно нужен блок thead **********/

		var gr = [];
		for (var j = 0; j < clg; j++) {
			gr[j] = tbl.rows[1].cells[j].innerHTML + 'q'; // любая буква, чтобы было отличие в 1-й строке
		}

		var cnt = 0; // счетчик подряд встречающихся несовпадений
		var cellCount = tbl.rows[1].cells.length;
		var idx = 1; // индекс текущей строки
		while (idx < tbl.rows.length) {
			for (j = 0; j < clg; j++) {
				var cc = tbl.rows[idx].cells[j]; // сокр. от CurrentCell
				if (gr[j] != cc.innerHTML) {
					gr[j] = cc.innerHTML;
					tbl.insertRow(idx);
					tbl.rows[idx].className = 'lev' + (j+1).toString();
					for (var i = 0; i < cellCount; i++) {
						tbl.rows[idx].insertCell(i);
					}
					cc = tbl.rows[idx].cells[j];
					cc.innerHTML = '<label><input type="checkbox"><span>' + gr[j] + '</span></label>';
					QS(cc,'span').onclick = sh;
					cnt++;
					idx++;
				} else {
					tbl.rows[idx].className = 'lev' + (clg+1).toString();
					tbl.rows[idx].style.background = '#fff';
					continue;
				}
			}
			// если все элементы массива <> текущей строке, то значит мы сделали только группирующие строки, и текущий индекс строки (idx) надо уменьшить, иначе ниже
			// по тексту idx++ сделает "перепрыг" через хорошую строку с данными
			if (cnt == clg) {idx = idx-1;}
			cnt = 0;
			idx++;

			if (tbl.rows[idx-1].className == 'lev' + (clg+1).toString()) {
				for (j=0; j < clg; j++) {tbl.rows[idx-1].cells[j].innerHTML = '';}
			}
		} // while

		cmdMakeGroup.disabled = true;
		cmdCollapseAll.disabled = false;
		cmdExpandAll.disabled = false;
	} // makeGroupTable

	function resetAll(tbl) {
		var cs = tbl.getElementsByTagName('input'), cnt = cs.length;
		for (i=0; i < cnt; i++) {
			if (cs[i].type == 'checkbox') {
				cs[i].checked = false;
			}
		}
	}

	function showLevel(row,lv) {
		var tBody = row.parentNode;
		var i = row.rowIndex;
		row = tBody.rows[i]; // Попытка перейти к следующей строке
		while (row && row.className.substring(3)*1 > lv) {
			if (row.className.substring(3)*1 == lv+1) {
				row.style.display = 'table-row';
				if (QS(row,'td input') && QS(row,'td input').checked) {
					showLevel(row,lv+1);
				}
			}
			i++;
			row = tBody.rows[i];
		}
	}

	function hideLevel(row,lv) {
		var i = row.rowIndex;
		var tBody = row.parentNode;
		row = tBody.rows[i]; // Попытка перейти к следующей строке
		while (row && row.className.substring(3)*1 > lv) {
			row.style.display = 'none';
			i++;
			row = tBody.rows[i];
		}
	}

	function sh(e) {
		var row = this.parentNode.parentNode.parentNode;
		var lv = row.className.substring(3) * 1; // Уровень строки, циферка после 'lev'
		if (QS(row,'td input').checked) {
			hideLevel(row,lv);
		} else {
			showLevel(row,lv);
		}
	}

	function swapAll(tbl, b) {
		var cnt = tbl.rows.length;
		for (var i=1; i < cnt; i++) {
			if (tbl.rows[i].className != 'lev1') {
				if (b) {tbl.rows[i].style.display = 'table-row';}
				else {tbl.rows[i].style.display = 'none';}
			}
			if (QS(tbl.rows[i],'td input')) {
				QS(tbl.rows[i],'td input').checked = b;
			}
		} // for
	} // swapAll
} // initGroup()

document.body.onload = initGroup;
