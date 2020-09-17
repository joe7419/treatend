const page_header = {
    "links": {
        "pagination": {
            "total": 50,
            "per_page": 15,
            "current_page": 1,
            "last_page": 4,
            "next_page_url": "...",
            "prev_page_url": "...",
            "from": 1,
            "to": 15,
        }
    },
}
0

function get_arrange(current_page, total_count, per_page_count) {
    let total_page = Math.ceil(total_count / per_page_count)
    let start = (current_page - 1) * per_page_count // 从1开始编页码
    let end = current_page * per_page_count
    return {start, end, total_page}
}

function bind_pagination(data, total_record_count, records_per_page,
                         current_page, last_page, current_page_from, current_page_to) {

    return {
        ...{data}, ...{
            "links": {
                "pagination": {
                    "total": total_record_count,
                    "per_page": records_per_page,
                    "current_page": current_page,
                    "last_page": last_page,
                    "next_page_url": "",
                    "prev_page_url": "",
                    "from": current_page_from,
                    "to": current_page_to,
                }
            }
        }
    }
}

module.exports = {bind_pagination, get_arrange}