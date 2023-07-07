import { useRouter } from 'next/router';

// existing code...

export default function Challenge() {
    const router = useRouter()
    const {slug} = router.query

    // existing code...

    useEffect(() => {
        if (!slug) {
            return;
        }

        const fetchData = async () => {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + slug;
                const requestOptions = {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                    },
                };
                const response = await fetch(endPoint, requestOptions);
                const result = await response.json();

                if (!result) {
                    router.push('/404');
                    return;
                }

                setChallenge(result);
            } catch (err) {
                throw err;
            }
        };
        fetchData();
    }, [slug]);

    // existing code...
}