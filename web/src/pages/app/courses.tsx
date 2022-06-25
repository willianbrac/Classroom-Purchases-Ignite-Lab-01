/* eslint-disable @next/next/no-img-element */
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Head from "next/head";
import { CalendarIcon } from "@heroicons/react/solid";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { withApollo } from "../../lib/withApollo";
import { useMe } from "../../graphql/generated/page";
import Link from "next/link";

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

function Courses() {
  const { data } = useMe()

  return (
    <>
      <Head>
        <title>Meus cursos</title>
        <link rel="shortcut icon" href="favicon.png" type="image/png" />
      </Head>

      <div className="bg-white">
        <div className="relative overflow-hidden bg-gray-50">
          <Header />
          <main className="py-20 max-w-7xl mx-auto ">
            <div className="text-center mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
              <h2 className="text-base font-semibold tracking-wider text-cyan-600 uppercase">Estudar</h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                Meus cursos
              </p>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md mt-8">
              <ul role="list" className="divide-y divide-gray-200">

                {data?.me.enrollments.map((enrollment) => (
                  <li key={enrollment.id}>
                    <div className="px-4 py-4 flex items-center sm:px-6">
                      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <div className="truncate">
                          <div className="flex text-sm">
                            <p className="font-medium text-indigo-600 truncate">{enrollment.course.title}</p>
                            <p className="ml-1 flex-shrink-0 font-normal text-gray-500">em Programação</p>
                          </div>
                          <div className="mt-2 flex">
                            <div className="flex items-center text-sm text-gray-500">
                              <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                              <p>
                                Turma inicia em <time dateTime={enrollment.createdAt}> {dateFormatter.format(new Date(enrollment.createdAt))}</time>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                          <div className="flex overflow-hidden -space-x-1">
                            {/* aplicants space */}
                          </div>
                        </div>
                      </div>
                      <div className="ml-5 flex-shrink-0">
                        <Link href={`/app/courses/${enrollment.course.slug}`}>
                          <a className="px-2 py-1 border border-transparent text-base font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700">
                            Assistir aulas
                          </a>
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = withPageAuthRequired({
  returnTo: '/'
})

export default withApollo(Courses)