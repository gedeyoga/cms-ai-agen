<script lang="ts" setup>
import Button from '../ui/button/Button.vue'
import Input from '../ui/input/Input.vue'
import BoxMessage from './BoxMessage.vue'
</script>

<template>
    <div class="flex flex-col w-full h-full">
        <div class="flex justify-between p-4 border-b border-gray-800">
            <div class="flex items-center">
                <div>
                    <img
                        class="w-10 h-10 rounded-full object-center"
                        src="https://gravatar.com/avatar/5c3e210bcdb637430f921e6f9a956ab1eda894dc9fe019fdd6b7c7f701dcf2e7"
                        alt=""
                    />
                </div>
                <div class="ml-3">
                    <p class="text-lg font-semibold">Yoga Permana</p>
                    <p class="text-sm text-gray-400">Online</p>
                </div>
            </div>
            <div class="flex items-center">
                <Button>Detail</Button>
            </div>
        </div>
        <div
            class="grow-1 h-full p-4 overflow-y-scroll overflow-hidden flex flex-col-reverse"
        >
            <BoxMessage :position="'left'"></BoxMessage>
        </div>
        <div class="flex items-center p-4 border-t border-gray-800">
            <Input placeholder="Type message..."></Input>
        </div>
    </div>
</template>
