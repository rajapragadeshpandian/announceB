import { formatISO } from 'date-fns';
import { Table, Tag, Space } from 'antd';
//import ColumnFilter from './ColumnFilter';

export const columns = [
    {
        title: 'Name',
        dataIndex: 'title',
        key: 'title',
        align: 'left',
        render: (text, record) => (
            <Space size="small">
                <strong>{text}</strong>
                {record.category.map(tag => {
                    let color;
                    if (tag === 'fix') {
                        color = 'red';
                    } else if (tag === "new") {
                        color = 'blue'
                    } else {
                        color = 'violet';
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </Space>
        ),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Views',
        dataIndex: 'visits',
        key: 'visits',
    },
    {
        title: 'Published At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date) => {
            let formatDate = date.substring(0, 10);
            let duration;
            const date1 = new Date(formatDate);
            const date2 = new Date();
            const diffTime = Math.abs(date2 - date1);
            const publishCheck = date2 - date1 > 0 ? 'ago' : ' from now';
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            console.log(diffDays + " days");

            if (diffDays > 0 && diffDays <= 30) {
                duration = `${diffDays} days ${publishCheck}`
            } else if (diffDays > 30 && diffDays <= 365) {
                let months = Math.ceil(diffDays / 12);
                duration = `${months} months ${publishCheck}`;
            } else if (diffDays > 365) {
                let years = Math.ceil(diffDays / 365);
                duration = `${years} years ${publishCheck}`;
            }
            console.log(duration);
            return (
                <>
                    <span>{duration}</span>
                </>
            )
        }
    },

    //var date = new Date("2013-03-10T02:00:00Z");
    //date.toISOString().substring(0, 10);
    // {
    //     title: 'Tags',
    //     key: 'tags',
    //     dataIndex: 'tags',
    //     render: tags => (
    //         <>
    //             {tags.map(tag => {
    //                 let color = tag.length > 5 ? 'geekblue' : 'green';
    //                 if (tag === 'loser') {
    //                     color = 'volcano';
    //                 }
    //                 return (
    //                     <Tag color={color} key={tag}>
    //                         {tag.toUpperCase()}
    //                     </Tag>
    //                 );
    //             })}
    //         </>
    //     ),
    // },
    // {
    //     title: 'Action',
    //     key: 'action',
    //     render: (text, record) => (
    //         <Space size="middle">
    //             <a>Invite {record.name}</a>
    //             <a>Delete</a>
    //         </Space>
    //     ),
    // },
];

export const data = [
    {
        key: '1',
        name: 'John Brown',
        views: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['new', 'fix'],
        status: "published",
        published: '-'
    },
    {
        key: '2',
        name: 'Jim Green',
        views: 42,
        address: 'London No. 1 Lake Park',
        tags: ['new'],
        status: "scheduled",
        published: '-'
    },
    {
        key: '3',
        name: 'Joe Black',
        views: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['fix', 'bug'],
        status: "published",
        published: '-'
    },
];

