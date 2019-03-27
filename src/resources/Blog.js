/* eslint-disable eol-last */
/* eslint-disable indent */
export default {
    blog() {
        return {
            path: '/blog.json',
            resolve: (response, mappers) => {
                let blog = response.results[0]
                return mappers.merge({
                    title: blog.title,
                    labels: {
                        post: blog.post_label,
                        tag: blog.tag_label
                    }
                })
            }
        }
    }
}