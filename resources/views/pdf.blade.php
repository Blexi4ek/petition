<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    </head>

<body style="font-family: DejaVu Sans;padding:20px 50px;font-size:18px">
<div class="col-md-8 descr-block">
    <p style="font-family: DejaVu Sans; font-size: 36px; text-transform: uppercase;  ">
        Заголовок петиції
    </p>
    <p style ="font-family: DejaVu Sans; ">
        <strong>
            {{$petition['name']}}
        </strong>
    </p>
    <p>
        ПІБ ініціатора:
        <span>
            {{$petition->userCreator->name}}
        </span>
        <br>
        <span>Статус:</span>
        <span>{{$status}}</span>
        <br>
        <span>Петиція</span>
        <span>№{{$petition['id']}}</span>
        <br>
        <span>Дата початку збору підписів:</span>
        <span>{{$date}}</span>
    </p>
    <p style="font-family: DejaVu Sans; font-size: 36px; text-transform: uppercase;  ">
        Суть електронної петиції
    </p>
    <p>
        {{$petition['description']}}
    </p>

    <p style="font-family: DejaVu Sans; font-size: 36px; text-transform: uppercase;  ">
        Відповідь
    </p>
    <p>
        {{$petition['answer']}}
    </p>
</div>

</body>

</html>
