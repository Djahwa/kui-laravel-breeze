import { defineComponent, withModifiers, Transition } from 'vue'
import { Link, useForm, usePage } from '@inertiajs/vue3'
import InputError from '@/Components/InputError'
import Label from '@/Components/Label'
import Button from '@/Components/Button'
import Input from '@/Components/Input'

export default defineComponent({
    props: {
        mustVerifyEmail: Boolean,
        status: String,
    },

    setup(props) {
        const user = usePage().props.auth.user

        const form = useForm({
            name: user.name,
            email: user.email,
        })

        const submit = () => {
            form.patch(route('profile.update'))
        }

        return () => (
            <section>
                <header>
                    <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Profile Information
                    </h2>

                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Update your account's profile information and email
                        address.
                    </p>
                </header>

                <form
                    onSubmit={withModifiers(submit, ['prevent'])}
                    class="mt-6 space-y-6"
                >
                    <div>
                        <Label for="name" value="Name" />

                        <Input
                            id="name"
                            type="text"
                            class="mt-1 block w-full"
                            v-model={form.name}
                            required
                            autofocus
                            autocomplete="name"
                        />

                        <InputError class="mt-2" message={form.errors.name} />
                    </div>

                    <div>
                        <Label for="email" value="Email" />

                        <Input
                            id="email"
                            type="email"
                            class="mt-1 block w-full"
                            v-model={form.email}
                            required
                            autocomplete="email"
                        />

                        <InputError class="mt-2" message={form.errors.email} />
                    </div>

                    {props.mustVerifyEmail && user.email_verified_at === null && (
                        <div>
                            <p class="text-sm mt-2 text-gray-800 dark:text-gray-200">
                                Your email address is unverified.
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    class="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                                >
                                    Click here to re-send the verification email.
                                </Link>
                            </p>

                            <div
                                v-show={props.status === 'verification-link-sent'}
                                class="mt-2 font-medium text-sm text-green-600 dark:text-green-400"
                            >
                                A new verification link has been sent to your email
                                address.
                            </div>
                        </div>
                    )}

                    <div class="flex items-center gap-4">
                        <Button disabled={form.processing}>Save</Button>

                        <Transition
                            enter-from-class="opacity-0"
                            leave-to-class="opacity-0"
                            class="transition ease-in-out"
                        >
                            {form.recentlySuccessful && (
                                <p class="text-sm text-gray-600 dark:text-gray-400">
                                    Saved.
                                </p>
                            )}
                        </Transition>
                    </div>
                </form>
            </section>
        )
    },
})
