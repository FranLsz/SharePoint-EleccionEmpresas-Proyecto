import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({ name: 'acortarTexto' })
export class AcortarTexto implements PipeTransform {

    transform(input: any, args: string[]): any {

        var length = args[0];
        if (input.length > length)
            input = input.substring(0, length) + '...';

        return input;
    }
}