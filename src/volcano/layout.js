export function layout() {
    this.wrap.append('div').attr('class', 'top');
    this.wrap.append('div').attr('class', 'middle');
    var bottom = this.wrap.append('div').attr('class', 'bottom');
    bottom.append('div').attr('class', 'info third');
    bottom.append('div').attr('class', 'summarytable third');
    bottom.append('div').attr('class', 'details third');
}
